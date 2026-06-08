// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    batch,
    computed,
    constant,
    reactive,
    ReadonlyReactive,
    watchValue
} from "@conterra/reactivity-core";
import { createLogger, destroyResource, Error, Resource } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ErrorId } from "../errors";
import { ApplicationMetadata, MessageLoader, MessagesRecord } from "../metadata";
import { unwrapBox } from "../metadata/ObservableBox";
import { Locale } from "./Locale";
import { createPackageIntl, PackageIntl } from "./PackageIntl";
import { LocalePicker, getBrowserLocales } from "./pick";

const LOG = createLogger(sourceId);

/**
 * Represents i18n info for the entire application.
 * Currently not exposed to user code.
 */
export interface AppIntl {
    destroy(): void;

    /** Chosen locale */
    readonly locale: Locale;

    /**
     * The locale of the currently loaded message bundle.
     * Always one of {@link supportedMessageLocales}.
     */
    readonly messageLocale: Locale;

    /** Supported locales from app metadata. */
    readonly supportedMessageLocales: readonly Locale[];

    /** True if reactive locale switching is enabled. */
    readonly reactiveSwitching: boolean;

    /**
     * Checks if the given locale is supported by the app.
     */
    supportsLocale(locale: Locale): boolean;

    /**
     * Switches to the given locale. Only allowed when reactive switching is enabled
     * (otherwise the runtime restarts the application instead).
     */
    setLocale(locale: Locale | undefined): Promise<void>;

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
     * If true, locale switching via {@link AppIntl.setLocale} is supported and
     * applied in place (locale, messageLocale and PackageIntl instances become reactive).
     *
     * If false (default), {@link AppIntl.setLocale} throws and the application
     * must be restarted to apply locale changes.
     */
    reactiveSwitching?: boolean;

    /** hook given by AppInstance to trigger restart of the application. Called by setLocale when reactive switching is OFF. */
    restartWithLocale(locale: Locale | undefined): void;
}

/**
 * Initializes the application's locale and fetches the appropriate i18n messages.
 */
export async function initI18n({
    appMetadata,
    forcedLocale,
    restrictSupportedLocales,
    reactiveSwitching = false,
    restartWithLocale
}: I18nOptions): Promise<AppIntl> {
    const messageLocaleStrings = appMetadata?.locales ?? [];
    const effectiveSupportedLocales = filterAvailableLocales(
        messageLocaleStrings,
        restrictSupportedLocales
    );
    const userLocales = getBrowserLocales();
    const preferredLocale = Locale.tryParse(forcedLocale);
    if (LOG.isDebug()) {
        LOG.debug(
            `Attempting to pick locale for user (locales: ${userLocales
                .map((l) => l.tag)
                .join(", ")}) from app (locales: ${messageLocaleStrings.join(
                ", "
            )} restricted to ${effectiveSupportedLocales.map((l) => l.tag).join(", ")})  [forcedLocale=${preferredLocale?.tag}].`
        );
    }

    const localePicker = new LocalePicker(effectiveSupportedLocales);
    const { locale: initialLocale, messageLocale: initialMessageLocale } =
        localePicker.pickSupportedLocale(preferredLocale, userLocales);

    if (LOG.isDebug()) {
        LOG.debug(
            `Using locale '${initialLocale.tag}' with messages from locale '${initialMessageLocale.tag}'.`
        );
    }

    const messages = reactive<MessagesRecord>(
        // Initial load of i18n messages.
        // During development, i18n messages are also loaded when they change on disk (see below).
        await loadMessagesSafely(appMetadata, initialMessageLocale)
    );

    // During dev: watch for changes of the loadMessage function
    // and fetch new I18N messages if the user edited any i18n file.
    let hmrWatch: Resource | undefined;
    if (import.meta.hot) {
        async function applyHotUpdate(loader: MessageLoader): Promise<void> {
            const newMessages = (await loader(messageLocale.value.tag)) ?? {};
            LOG.debug("Applying new i18n messages", newMessages);
            messages.value = newMessages;
        }
        hmrWatch = watchValue(
            () => (appMetadata?.loadMessages ? unwrapBox(appMetadata.loadMessages) : undefined),
            (loader) => {
                if (!loader) {
                    return;
                }
                applyHotUpdate(loader).catch((e) => {
                    LOG.error(`Failed to load messages after hot reload`, e);
                });
            }
        );
    }

    /** Monotonic counter to discard outdated setLocale results. */
    let setLocaleSeq = 0;
    const locale = reactive(initialLocale);
    const messageLocale = reactive(initialMessageLocale);

    return {
        get locale() {
            return locale.value;
        },
        get messageLocale() {
            return messageLocale.value;
        },
        get supportedMessageLocales() {
            return effectiveSupportedLocales;
        },
        get reactiveSwitching() {
            return reactiveSwitching;
        },
        destroy() {
            hmrWatch = destroyResource(hmrWatch);
        },
        supportsLocale(locale) {
            return localePicker.supportsLocale(locale);
        },
        async setLocale(targetLocale) {
            if (targetLocale && !localePicker.supportsLocale(targetLocale)) {
                throw new Error(
                    ErrorId.UNSUPPORTED_LOCALE,
                    `Unsupported locale '${targetLocale.tag}' (supported locales: ${effectiveSupportedLocales.map((l) => l.tag).join(", ")}).`
                );
            }
            if (!reactiveSwitching) {
                restartWithLocale(targetLocale);
                return Promise.resolve();
            }
            const { locale: nextLocale, messageLocale: nextMessageLocale } =
                localePicker.pickSupportedLocale(targetLocale, userLocales);
            const seq = ++setLocaleSeq;
            const newMessages = await loadMessagesSafely(appMetadata, nextMessageLocale);
            if (seq !== setLocaleSeq) {
                // Superseded by a newer setLocale call: drop the result.
                return;
            }
            batch(() => {
                messages.value = newMessages;
                locale.value = nextLocale;
                messageLocale.value = nextMessageLocale;
            });

            if (LOG.isDebug()) {
                LOG.debug(
                    `Locale switched: locale='${nextLocale.tag}', messageLocale='${nextMessageLocale.tag}'.`
                );
            }
        },
        createPackageI18n(packageName) {
            if (import.meta.hot || reactiveSwitching) {
                const packageMessages = computed(() => messages.value[packageName] ?? {}, {
                    equal: shallowRecordEquals
                });

                let firstCall = true;
                return computed(() => {
                    if (!firstCall) {
                        LOG.info("Updating i18n messages of package", packageName);
                    }
                    firstCall = false;
                    //NOTE: locale instead of messageLocale is intentional,
                    // to ensure that number formatting is still according to the current locale
                    return createPackageIntl(locale.value.tag, packageMessages.value);
                });
            } else {
                const packageMessages = messages.value[packageName] ?? {};
                //NOTE: locale instead of messageLocale is intentional,
                // to ensure that number formatting is still according to the current locale
                const packageIntl = createPackageIntl(locale.value.tag, packageMessages);
                return constant(packageIntl);
            }
        }
    };
}

function filterAvailableLocales(
    // locales from app metadata
    messageLocaleStrings: readonly string[],
    // optional restriction on supported locales, must be subset of messageLocaleStrings
    restrictSupportedLocales: readonly string[] | undefined
): readonly Locale[] {
    //NOTE: the set preserves the order of 'restrictSupportedLocales', this is relevant and intentional.
    const localesToSupport = new Set(restrictSupportedLocales ?? messageLocaleStrings);
    const supportedLocales: Locale[] = [];
    for (const l of localesToSupport) {
        if (!messageLocaleStrings.includes(l)) {
            LOG.warn(`Locale '${l}' is not included in app metadata locales and will be ignored.`);
            continue;
        }
        const locale = Locale.tryParse(l);
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
    messageLocale: Locale
): Promise<MessagesRecord> {
    const messageLocales = appMetadata?.locales ?? [];
    if (!appMetadata?.loadMessages || !messageLocales.includes(messageLocale.tag)) {
        return {};
    }

    try {
        const loader = unwrapBox(appMetadata.loadMessages);
        const messagesRecord = await loader(messageLocale.tag);
        if (messagesRecord) {
            return messagesRecord;
        }
        console.warn(
            `I18n messages couldn't be loaded. Check if your runtimeMeta version is not set to 1.0.0.`
        );
        if (LOG.isDebug()) {
            LOG.debug(`appMetadata.loadMessages doesn't support signal value'.`);
        }
        return {};
    } catch (e) {
        throw new Error(
            ErrorId.INTERNAL,
            `Failed to load messages for locale '${messageLocale.tag}'.`,
            {
                cause: e
            }
        );
    }
}

// TODO: Move into @open-pioneer/core; consider using a third party lib
function shallowRecordEquals(a: Record<string, unknown>, b: Record<string, unknown>) {
    const keysA = new Set(Object.keys(a));
    const keysB = new Set(Object.keys(b));
    if (keysA.size !== keysB.size) {
        return false;
    }
    for (const k of keysA) {
        if (!keysB.has(k)) {
            return false;
        }
    }
    for (const k of keysB) {
        if (!keysA.has(k)) {
            return false;
        }
    }

    for (const k of keysA) {
        const va = a[k];
        const vb = b[k];
        if (va !== vb) {
            return false;
        }
    }

    return true;
}
