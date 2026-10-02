# Trails core packages

The core packages of the Open Pioneer Trails client framework.
`runtime` turns a React component and generated app metadata into a web component with a service layer, and the other
packages provide services and UI building blocks on top of it.

This document defines the words the project uses for its own concepts.
Where two words exist for the same thing, the preferred one is defined and the rejected ones are listed under _Avoid_.
Use the preferred term in code, in commit messages, in issues, and in documentation.
The framework's user-facing glossary is `docs/Glossary.md` in https://github.com/open-pioneer/trails-starter.
The definitions here agree with it and add the words that only matter inside the runtime.

The _Avoid_ lists govern the names we choose for our own concepts.
They never govern a name a library gives us: React's `Component`, Chakra's `Toast`, `Dialog` and `SystemConfig`, the
DOM's `ShadowRoot` and `CustomElementRegistry`, and FormatJS's `IntlShape` keep the names their libraries gave them.

## Language

### Framework and apps

**Open Pioneer Trails (Trails)**:
The client framework these packages implement.
It provides the runtime, the service layer, the package format and the build tooling.
The short form "Trails" is fine in prose.

**Trails package**:
A package with a `build.config.mjs`, which the build tooling analyzes and links into an app.
Every directory under `src/packages/` and every app package in a sample is one.
_Avoid_: pioneer package, framework package, module (which means a JavaScript file here)

**App**:
The web component the framework produces: the custom element class returned by `createCustomElement()` and the
element of that class in a page.
Its `when()` method resolves to the web component API once the app has started.
_Avoid_: application (as a noun for the component), widget, project

**App package**:
The Trails package that creates an app, in its `app.ts`, by calling `createCustomElement()` and
`customElements.define()`.
In this repository every app package lives inside a sample.
The user manual calls it an application package; both spellings mean the same thing.

**Sample**:
A directory under `src/samples/<name>/` holding a site and the app package it loads, either as a subdirectory such as
`api-sample/api-app/` or as the sample directory itself.
The samples are the manual test bed of the packages and are deployed as the public demo.
_Avoid_: example, demo app, test app, playground

**Site**:
An `index.html` that the Vite plugin includes in the build: the root site `src/index.html` and one per sample.

**Host element**:
The DOM node of an app in the page, `ApplicationContext.getHostElement()`.
The embedding page owns it; the app renders inside it.
_Avoid_: custom element node, container

**Root node**:
The `Document` or `ShadowRoot` that holds the app's DOM and styles (`RootNode`).
It is the shadow root by default and the document when `advanced.enableShadowRoot` is `false`, so code that searches the
DOM uses `ApplicationContext.getRoot()` instead of `document`.

**App root**:
The `<div class="pioneer-root">` inside the root node that contains the whole React tree and carries the `lang`
attribute (`APP_ROOT_CLASS`, `ApplicationContext.getApplicationContainer()`).
_Avoid_: mount point, app container

**App instance**:
The object that runs one connected app (`AppInstance`), with the states `not-started`, `starting`, `started`,
`destroyed` and `error`.
Disconnecting the element destroys it, and a locale change without live locale changes restarts it with overrides.

**Element options**:
What the app package passes to `createCustomElement()` (`CustomElementOptions`): the component, the app metadata, a
static `config`, a `resolveConfig()` hook, the `chakraSystemConfig` and the `advanced` switches.

**Application config**:
The merged runtime configuration of one app instance (`ApplicationConfig`): `locale`, `supportedLocales`,
`colorMode`, `properties` and `chakraSystemConfig`.
`gatherConfig()` builds it from the static `config`, the result of `resolveConfig()` and any overrides.
_Avoid_: settings, app config (which names a `config.json` file in other Trails projects)

**Overrides**:
The values an app instance is restarted with (`ApplicationOverrides`): locale, color mode and Chakra system config.
They win over the application config and cannot be changed by `resolveConfig()`.
Unrelated to pnpm overrides in `pnpm-workspace.yaml`.

**App metadata**:
The object the virtual module `open-pioneer:app` exports (`ApplicationMetadata`): the package metadata of every
package in the app, the aggregated styles, the supported locales and the message loader.
The Vite plugin generates it; tests build it by hand.
_Avoid_: manifest, build metadata

**Package metadata**:
The runtime description of one Trails package (`PackageMetadata`): name, services, UI references and properties.
The build tooling uses the same words for the serialized form it writes into a published `package.json`; in this
repository the runtime object is meant.

**Build config**:
The `build.config.mjs` of a Trails package.
It declares entry points, styles, i18n languages, services, UI references, properties and the publish config.
_Avoid_: package config, pioneer config

**Entry point**:
A module of a Trails package that consumers may import, listed under `entryPoints` in the build config and rendered by
TypeDoc.
Every other module is private to the package.

**Services module**:
The `services.ts` of a Trails package, which exports the service classes named in the build config.
It is an entry point that the author does not list.

**Virtual module**:
A module with an `open-pioneer:` prefix that the Vite plugin generates instead of reading from disk: `open-pioneer:app`,
`open-pioneer:react-hooks`, `open-pioneer:source-info` and `open-pioneer:deployment`.
Their types come from `@open-pioneer/vite-plugin-pioneer/client`.

### Services

**Service**:
An object the service layer constructs once per app instance from a service class declared in a build config.
It receives its references, properties and intl through `ServiceOptions` and may implement `destroy()`.
_Avoid_: bean, singleton, provider

**Service class**:
The class behind a service, named `<Interface>Impl` and exported from the services module, for example
`HttpServiceImpl`.
_Avoid_: service implementation (in identifiers), handler

**Service factory**:
A class marked with `defineServiceFactory()` whose `createService()` returns the service instance and whose optional
`destroyService()` releases it.
Used when constructing the service needs more than a constructor.

**Interface**:
A named contract, written as the string `"<short name>.<Name>"` such as `"http.HttpService"`, where the short name is
the package name without the scope.
Services provide interfaces and references name them; the runtime compares names, never shapes.
_Avoid_: service name (which is the key under `services` in the build config), token, DI key

**Declared service**:
A TypeScript interface that extends `DeclaredService<"<short name>.<Name>">`, or a class with
`declare [DECLARE_SERVICE_INTERFACE]`.
It ties the type to its interface name, so `useService<T>()` and `createService()` can check the string at compile
time.

**Provided interface**:
An interface a service lists under `provides`, optionally with a qualifier.

**Reference**:
A service's declared need for an interface, injected into its constructor under the reference name in
`options.references`, with the service id of the injected instance in `options.referencesMeta`.
A reference resolves to one service, or to an array when declared with `all: true`.
_Avoid_: dependency (which means an npm dependency here), injection

**Qualifier**:
A string that tells implementations of the same interface apart, set on a provided interface and matched by a
reference.
The builtin services carry the qualifier `builtin`.

**UI reference**:
An interface a package's React code uses, declared under `ui.references` in the build config.
The hooks of `open-pioneer:react-hooks` hand out only services declared this way and throw
`runtime:undeclared-dependency` otherwise.

**Required service**:
A service the service layer actually starts: the UI references of every package, the builtin services the runtime
needs, every `runtime.AutoStart` implementation, and their transitive dependencies.
A declared service nobody requires stays unconstructed.
_Avoid_: active service, eager service

**Service layer**:
The part of `runtime` (`ServiceLayer`, `verifyDependencies`, `PackageRepr`, `ServiceRepr`) that verifies the
dependency graph, starts the required services in dependency order, resolves lookups for the UI and destroys the
services in reverse order.
_Avoid_: DI container, injector, service registry

**Property**:
A named configuration value of a Trails package with a default in the build config, which the application config may
override under the package's name.
Services read `options.properties`, React code calls `useProperties()`.
_Avoid_: setting, option, parameter

**Web component API**:
The methods a page can call on a started app after `element.when()` resolves.
Every service providing `integration.ApiExtension` contributes some through `getApiMethods()`, and
`runtime.ApiService` merges them; two extensions providing the same method name are an error.
_Avoid_: public API (which means the exported TypeScript surface of a package), external API

**Lifecycle listener**:
A service providing `runtime.ApplicationLifecycleListener`, called with `afterApplicationStart()` once the app is
started and `beforeApplicationStop()` before the services are destroyed.

**Auto start**:
A service providing `runtime.AutoStart`.
The runtime references all of them, so such a service starts with the app even when nothing else references it.

### React integration

**Package context**:
The React context (`PackageContext`) through which the generated hooks reach services, properties and intl of a
package.
`ReactIntegration` provides it in an app, `PackageContextProvider` from `@open-pioneer/test-utils/react` provides it in
a test.

**Hooks**:
`useService`, `useServices`, `useProperties` and `useIntl` from `open-pioneer:react-hooks`.
The Vite plugin generates the module per package, binding the package name and forwarding to the `*Internal` hooks in
`runtime/react-integration`, which published packages import by name and which therefore stay stable.

**Signal**:
A value from `@conterra/reactivity-core` created with `reactive()`, `computed()` or `constant()` (`Reactive<T>`,
`ReadonlyReactive<T>`).
A class keeps its signals in private fields and exposes getters; React subscribes with `useReactiveSnapshot()`.
_Avoid_: observable, store, atom, state (as a noun for the mechanism)

**Resource**:
An object with a `destroy()` method (`Resource` from `core`), released with `destroyResource()` or
`destroyResources()`.
Services, watch handles and app instances are resources.
_Avoid_: disposable, subscription

**Color mode**:
`"light"` or `"dark"` (`ColorModeValue`), controlled by `runtime.ThemeService` and configured through the application
config, where `"system"` follows the browser.
_Avoid_: theme, dark mode (as a noun for the mechanism)

**Chakra system config**:
Chakra's `SystemConfig` that styles the app.
`base-theme` exports the default as `config`, and an app passes its own as `chakraSystemConfig`.
_Avoid_: theme object, theme (the option was renamed from `theme` in 4.0)

**Styles**:
The CSS of all packages in an app, aggregated by the build into `appMetadata.styles` and injected into the root node.
During development the box is updated on CSS changes.

**Snippet**:
A Chakra UI component downloaded with the Chakra CLI and shipped by `chakra-snippets`, one entry point per snippet.
The `unedited/` directory holds the downloaded original; the root file may carry marked local changes such as
translated labels.

**Error screen**:
The React tree the runtime renders in place of the app when startup fails (`ErrorScreen`).
Its messages are embedded in English and German because the message bundle may not have loaded.

**Notification**:
A message emitted through `notifier.NotificationService` and rendered by the `<Notifier />` component.
_Avoid_: toast (Chakra's implementation detail), alert, snackbar

### i18n

**Locale**:
The `Intl.Locale` used for formatting numbers and dates (`LocaleService.locale`), such as `de-DE`.
It shares its language with the message locale and may add the user's region.

**Message locale**:
The locale of the loaded message bundle (`LocaleService.messageLocale`), always one of the supported message locales,
for example `de`.
A package's messages live in `i18n/<message locale>.yaml`.
_Avoid_: language, lang

**Supported message locales**:
The locales an app ships messages for, taken from the `i18n` entry of the app package's build config and optionally
restricted by `ApplicationConfig.supportedLocales`.

**Message bundle**:
The messages of one message locale for every package in the app (`MessagesRecord`: package name to message id to
text), loaded through `appMetadata.loadMessages`.

**Package intl**:
The per-package i18n object (`PackageIntl`) with `formatMessage()`, `formatRichMessage()` and the FormatJS
formatters.
A service gets it as the `currentIntl` signal (the plain `intl` option is deprecated), React code through `useIntl()`.
_Avoid_: translator, i18n service

**Live locale change**:
Switching the locale while the app runs, enabled with `advanced.enableLiveLocaleChanges`.
Without it, `LocaleService.changeLocale()` restarts the app instance with overrides.

### Errors and logging

**Error id**:
The first argument of `Error` from `@open-pioneer/core`, a kebab-case string prefixed with the package's short name,
such as `runtime:interface-not-found`.
`runtime` collects its ids in the `ErrorId` enum.
_Avoid_: error code

**Logger**:
The object returned by `createLogger(prefix)`, usually `createLogger(sourceId)` with `sourceId` from
`open-pioneer:source-info`.
The global level comes from `__LOG_LEVEL__`.

**Deprecation**:
A warning printed once per deprecated entity in development builds by the function `deprecated()` returns.
A deprecated export also carries the `@deprecated` tag naming the alternative.

### Repository

**Changeset**:
A file under `.changeset/` describing a consumer-visible change to one or more published packages.
Because all `@open-pioneer/*` packages are in one fixed group, a release bumps every package to the same version.
