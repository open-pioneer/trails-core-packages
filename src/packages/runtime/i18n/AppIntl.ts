// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    batch,
    computed,
    constant,
    reactive,
    Reactive,
    ReadonlyReactive,
    watchValue
} from "@conterra/reactivity-core";
import {
    createLogger,
    destroyResource,
    Error,
    Resource,
    shallowEqual,
    throwAbortError
} from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ErrorId } from "../errors";
import { ApplicationMetadata, MessageLoader, MessagesRecord } from "../metadata";
import { unwrapBox } from "../metadata/ObservableBox";
import { tryParseLocale } from "./intl-locale";
import { createPackageIntl, PackageIntl } from "./PackageIntl";
import { LocalePicker, getBrowserLocales } from "./pick";

const LOG = createLogger(sourceId);

/**
 * Represents i18n info for the entire application.
 * Currently not exposed to user code.
 */
export interface AppIntl {
    destroy(): void;

    /** Locale for Intl formatting. */
    readonly locale: Intl.Locale;

    /**
     * The locale of the currently loaded message bundle.
     * Always one of {@link supportedMessageLocales}.
     */
    readonly messageLocale: Intl.Locale;

    /** Supported locales from app metadata. */
    readonly supportedMessageLocales: Intl.Locale[];

    /** True if reactive locale switching is enabled. */
    readonly supportsLiveChanges: boolean;

    /** True iff `locale` best-fits a supported bundle. */
    supportsLocale(locale: Intl.Locale): boolean;

    /**
     * Switches to `locale`. Best-fit match; throws `UNSUPPORTED_LOCALE` on no match.
     */
    changeLocale(locale: Intl.Locale | undefined): Promise<void>;

    /** Given the package name, constructs a package i18n instance. */
    createPackageI18n(packageName: string): ReadonlyReactive<PackageIntl>;
}

/**
 * Options for {@link initI18n}.
 */
export interface I18nOptions {
    // build metadata
    appMetadata: ApplicationMetadata | undefined;

    // locale override (e.g. from config or URL param)
    forcedLocale?: string | undefined;

    /**
     * Restriction on supported locales.
     * If provided, only these locales are considered for locale picking and switching.
     * If not provided, all locales from app metadata are supported.
     */
    restrictSupportedLocales?: readonly string[];

    /**
     * If true, locale switching via {@link AppIntl.changeLocale} is supported and
     * applied in place (locale, messageLocale and PackageIntl instances become reactive).
     *
     * If false (default), {@link AppIntl.changeLocale} triggers an application
     * restart via {@link restartWithLocale}.
     */
    supportsLiveChanges?: boolean;

    /** hook given by AppInstance to trigger restart of the application. Called by changeLocale when reactive switching is OFF. */
    restartWithLocale(locale: Intl.Locale | undefined): void;
}

/**
 * Initializes the application's locale and fetches the appropriate i18n messages.
 */
export async function initI18n({
    appMetadata,
    forcedLocale,
    restrictSupportedLocales,
    supportsLiveChanges = false,
    restartWithLocale
}: I18nOptions): Promise<AppIntl> {
    const messageLocaleStrings = appMetadata?.locales ?? [];
    const effectiveSupportedLocales = filterAvailableLocales(
        messageLocaleStrings,
        restrictSupportedLocales
    );
    const userLocales = getBrowserLocales();
    const preferredLocale = tryParseLocale(forcedLocale);
    if (LOG.isDebug()) {
        const userLocalesList = userLocales.map((l) => l.baseName).join(", ");
        const appLocalesList = messageLocaleStrings.join(", ");
        const effectiveLocalesList = effectiveSupportedLocales.map((l) => l.baseName).join(", ");
        LOG.debug(
            `Attempting to pick locale for user (locales: ${userLocalesList}) from app (locales: ${appLocalesList}; ` +
                `restricted to ${effectiveLocalesList})  [forcedLocale=${preferredLocale?.baseName}].`
        );
    }

    const localePicker = new LocalePicker(effectiveSupportedLocales);
    const { locale: initialLocale, messageLocale: initialMessageLocale } =
        localePicker.pickSupportedLocale(preferredLocale, userLocales);

    if (LOG.isDebug()) {
        LOG.debug(
            `Using locale '${initialLocale.baseName}' with messages from locale '${initialMessageLocale.baseName}'.`
        );
    }

    const initialMessages = await loadMessagesSafely(appMetadata, initialMessageLocale);
    return new AppIntlImpl({
        appMetadata,
        effectiveSupportedLocales,
        userLocales,
        localePicker,
        supportsLiveChanges,
        restartWithLocale,
        initialMessages,
        initialLocale,
        initialMessageLocale
    });
}

interface AppIntlImplOptions {
    appMetadata: ApplicationMetadata | undefined;
    effectiveSupportedLocales: Intl.Locale[];
    userLocales: Intl.Locale[];
    localePicker: LocalePicker;
    supportsLiveChanges: boolean;
    restartWithLocale: (locale: Intl.Locale | undefined) => void;
    initialMessages: MessagesRecord;
    initialLocale: Intl.Locale;
    initialMessageLocale: Intl.Locale;
}

class AppIntlImpl implements AppIntl {
    readonly #appMetadata: ApplicationMetadata | undefined;
    readonly #effectiveSupportedLocales: Intl.Locale[];
    readonly #userLocales: Intl.Locale[];
    readonly #localePicker: LocalePicker;
    readonly #supportsLiveChanges: boolean;
    readonly #restartWithLocale: (locale: Intl.Locale | undefined) => void;

    // Messages are reactive: they can change if the locale changes at runtime
    // or if the developer edits i18n files on disk during development.
    readonly #messages: Reactive<MessagesRecord>;

    // Locale and messageLocale support reactive changes if `supportsLiveChanges` is enabled.
    readonly #locale: Reactive<Intl.Locale>;
    readonly #messageLocale: Reactive<Intl.Locale>;

    /** During dev: watch for changes of the loadMessage function. */
    #hmrWatch: Resource | undefined;

    /** Monotonic counter to discard outdated changeLocale results. */
    #changeLocaleSeq = 0;

    constructor(options: AppIntlImplOptions) {
        this.#appMetadata = options.appMetadata;
        this.#effectiveSupportedLocales = options.effectiveSupportedLocales;
        this.#userLocales = options.userLocales;
        this.#localePicker = options.localePicker;
        this.#supportsLiveChanges = options.supportsLiveChanges;
        this.#restartWithLocale = options.restartWithLocale;

        this.#messages = reactive<MessagesRecord>(options.initialMessages);
        this.#locale = reactive(options.initialLocale);
        this.#messageLocale = reactive(options.initialMessageLocale);

        // During dev: watch for changes of the loadMessage function
        // and fetch new I18N messages if the user edited any i18n file.
        if (import.meta.hot) {
            this.#hmrWatch = watchValue(
                () =>
                    this.#appMetadata?.loadMessages
                        ? unwrapBox(this.#appMetadata.loadMessages)
                        : undefined,
                (loader) => {
                    if (!loader) {
                        return;
                    }
                    this.#applyHotUpdate(loader).catch((e) => {
                        LOG.error(`Failed to load messages after hot reload`, e);
                    });
                }
            );
        }
    }

    destroy(): void {
        this.#hmrWatch = destroyResource(this.#hmrWatch);
    }

    get locale(): Intl.Locale {
        return this.#locale.value;
    }

    get messageLocale(): Intl.Locale {
        return this.#messageLocale.value;
    }

    get supportedMessageLocales(): Intl.Locale[] {
        return this.#effectiveSupportedLocales;
    }

    get supportsLiveChanges(): boolean {
        return this.#supportsLiveChanges;
    }

    supportsLocale(locale: Intl.Locale): boolean {
        return this.#localePicker.supportsLocale(locale);
    }

    async changeLocale(targetLocale: Intl.Locale | undefined): Promise<void> {
        const { locale: nextLocale, messageLocale: nextMessageLocale } =
            this.#localePicker.pickSupportedLocale(targetLocale, this.#userLocales);
        if (!this.#supportsLiveChanges) {
            //NOTE: it is important for restarts to ensure the input value (targetLocale) is passed to restartWithLocale, not the best-fit value (nextLocale).
            this.#restartWithLocale(targetLocale);
            return;
        }
        const seq = ++this.#changeLocaleSeq;
        const newMessages = await loadMessagesSafely(this.#appMetadata, nextMessageLocale);
        if (seq !== this.#changeLocaleSeq) {
            // Superseded by a newer call.
            throwAbortError();
        }

        batch(() => {
            this.#messages.value = newMessages;
            this.#locale.value = nextLocale;
            this.#messageLocale.value = nextMessageLocale;
        });
        if (LOG.isDebug()) {
            LOG.debug(
                `Locale switched: locale='${nextLocale.baseName}', messageLocale='${nextMessageLocale.baseName}'.`
            );
        }
    }

    createPackageI18n(packageName: string): ReadonlyReactive<PackageIntl> {
        //NOTE: locale instead of messageLocale is intentional,
        // to ensure that number formatting is still according to the current locale
        const makeIntl = (packageMessages: Record<string, string>) =>
            createPackageIntl(this.#locale.value.baseName, packageMessages);

        if (import.meta.hot || this.#supportsLiveChanges) {
            const packageMessages = computed(() => this.#messages.value[packageName] ?? {}, {
                equal: shallowEqual
            });

            let firstCall = true;
            return computed(() => {
                if (!firstCall) {
                    LOG.info("Updating i18n messages of package", packageName);
                }
                firstCall = false;
                return makeIntl(packageMessages.value);
            });
        }
        return constant(makeIntl(this.#messages.value[packageName] ?? {}));
    }

    async #applyHotUpdate(loader: MessageLoader): Promise<void> {
        const newMessages = (await loader(this.#messageLocale.value.baseName)) ?? {};
        LOG.debug("Applying new i18n messages", newMessages);
        this.#messages.value = newMessages;
    }
}

function filterAvailableLocales(
    // locales from app metadata
    messageLocaleStrings: readonly string[],
    // optional restriction on supported locales, must be subset of messageLocaleStrings
    restrictSupportedLocales: readonly string[] | undefined
): Intl.Locale[] {
    //NOTE: the set preserves the order of 'restrictSupportedLocales', this is relevant and intentional.
    const isRestricted = restrictSupportedLocales != null;
    const localesToSupport = new Set(restrictSupportedLocales ?? messageLocaleStrings);
    const supportedLocales: Intl.Locale[] = [];
    for (const l of localesToSupport) {
        if (!messageLocaleStrings.includes(l)) {
            // 'supportedLocales' may only restrict the locales defined by the application, not extend them.
            // A value outside the application's message locales is a configuration error.
            if (isRestricted) {
                throw new Error(
                    ErrorId.UNSUPPORTED_LOCALE,
                    `Configured supported locale '${l}' is not one of the application's message locales [${messageLocaleStrings.join(", ")}].`
                );
            }
            LOG.warn(`Locale '${l}' is not included in app metadata locales and will be ignored.`);
            continue;
        }
        const locale = tryParseLocale(l);
        if (!locale) {
            LOG.warn(
                `Locale '${l}' from app metadata is not a valid BCP 47 tag and will be ignored.`
            );
            continue;
        }
        supportedLocales.push(locale);
    }
    if (supportedLocales.length === 0) {
        LOG.debug(
            `No valid supported locales found. Locale picking and switching will be unavailable.`
        );
    }
    return supportedLocales;
}

async function loadMessagesSafely(
    appMetadata: ApplicationMetadata | undefined,
    messageLocale: Intl.Locale
): Promise<MessagesRecord> {
    const messageLocales = appMetadata?.locales ?? [];
    if (!appMetadata?.loadMessages || !messageLocales.includes(messageLocale.baseName)) {
        return {};
    }

    try {
        const loader = unwrapBox(appMetadata.loadMessages);
        const messagesRecord = await loader(messageLocale.baseName);
        if (messagesRecord) {
            return messagesRecord;
        }

        throw new Error(ErrorId.INTERNAL, `Invalid result of loader function: ${messagesRecord}.`);
    } catch (e) {
        throw new Error(
            ErrorId.INTERNAL,
            `Failed to load messages for locale '${messageLocale.baseName}'.`,
            {
                cause: e
            }
        );
    }
}
