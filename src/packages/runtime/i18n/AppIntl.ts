// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, destroyResource, Error, Resource } from "@open-pioneer/core";
import { ErrorId } from "../errors";
import { ApplicationMetadata, MessageLoader, MessagesRecord } from "../metadata";
import { createPackageIntl, PackageIntl } from "./PackageIntl";
import { getBrowserLocales, I18nConfig } from "./pick";
import { computed, reactive, watchValue } from "@conterra/reactivity-core";
import { ReadonlyValue } from "../utils/ReadonlyValue";
const LOG = createLogger("runtime:i18n");

/**
 * Represents i18n info for the entire application.
 * Currently not exposed to user code.
 */
export interface AppIntl {
    destroy(): void;

    /** Chosen locale */
    readonly locale: string;

    /** Supported locales from app metadata. */
    readonly supportedMessageLocales: string[];

    /** True if the locale can be used in this application (i.e. if there are any messages). */
    supportsLocale(locale: string): boolean;

    /** Given the package name, constructs a package i18n instance. */
    createPackageI18n(packageName: string): ReadonlyValue<PackageIntl>;
}

/**
 * Initializes the application's locale and fetches the appropriate i18n messages.
 */
export async function initI18n(
    appMetadata: ApplicationMetadata | undefined,
    forcedLocale: string | undefined
): Promise<AppIntl> {
    const messageLocales = appMetadata?.locales ?? [];
    const userLocales = getBrowserLocales();
    if (LOG.isDebug()) {
        LOG.debug(
            `Attempting to pick locale for user (locales: ${userLocales.join(
                ", "
            )}) from app (supported locales: ${messageLocales.join(
                ", "
            )}) [forcedLocale=${forcedLocale}].`
        );
    }

    const i18nConfig = new I18nConfig(messageLocales);
    const { locale, messageLocale } = i18nConfig.pickSupportedLocale(forcedLocale, userLocales);

    if (LOG.isDebug()) {
        LOG.debug(`Using locale '${locale}' with messages from locale '${messageLocale}'.`);
    }

    const messages = reactive<MessagesRecord>({});
    if (messageLocales.includes(messageLocale)) {
        try {
            messages.value = (await appMetadata?.loadMessages?.value?.(messageLocale)) ?? {};
        } catch (e) {
            throw new Error(
                ErrorId.INTERNAL,
                `Failed to load messages for locale '${messageLocale}'.`,
                {
                    cause: e
                }
            );
        }
    }

    let hmrWatch: Resource | undefined;
    if (import.meta.hot) {
        // During dev: watch for changes of the loadMessage function
        // and fetch new I18N messages if the user edited any i18n file.
        hmrWatch = watchValue(
            () => appMetadata?.loadMessages?.value,
            (loadMessages) => {
                if (!loadMessages) {
                    return;
                }

                handleHotUpdate(loadMessages).catch((e) => {
                    LOG.error(`Failed to load messages after hot reload`, e);
                });
            }
        );

        async function handleHotUpdate(loadMessages: MessageLoader) {
            LOG.debug("I18n changed, loading new messages");
            const newMessages = (await loadMessages?.(messageLocale)) ?? {};

            LOG.debug("Applying new i18n messages", newMessages);
            messages.value = newMessages;
        }
    }

    return {
        locale,
        supportedMessageLocales: messageLocales,
        destroy() {
            hmrWatch = destroyResource(hmrWatch);
        },
        supportsLocale(locale) {
            return i18nConfig.supportsLocale(locale);
        },
        createPackageI18n(packageName) {
            if (import.meta.hot) {
                const packageMessages = computed(() => messages.value[packageName] ?? {}, {
                    equal: shallowRecordEquals
                });

                const packageIntl = computed(() => {
                    LOG.debug("Recomputing i18n object for package", packageName);
                    return createPackageIntl(locale, packageMessages.value);
                });
                return packageIntl;
            } else {
                const packageMessages = messages.value[packageName] ?? {};
                const packageIntl = createPackageIntl(locale, packageMessages);
                return {
                    value: packageIntl
                };
            }
        }
    };
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
