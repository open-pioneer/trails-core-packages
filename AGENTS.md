# AI Agent Guide: trails-core-packages

This repository holds the core packages of the **Open Pioneer Trails** client framework, published to npm under
`@open-pioneer/*`.
`runtime` turns a React component plus generated app metadata into a web component with a service layer.
The other packages provide the services and UI building blocks that Trails apps use on top of it.
The samples under `src/samples/` exercise the packages and are deployed as the public demo.

This file is the single source of truth for agents.
`CLAUDE.md` and `.github/copilot-instructions.md` only point here.

## Read next

| Document                                                  | Read it when                                                                                                                                                                                                                                    |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CONTEXT.md](CONTEXT.md)                                  | Always, before touching the code. Defines the project's words (app, service, interface, reference, property, package intl) and the synonyms to avoid.                                                                                           |
| `src/packages/<name>/README.md`                           | Changing a package's public API or behavior. The README is published on npm, so it changes with the code.                                                                                                                                       |
| `docs/` in https://github.com/open-pioneer/trails-starter | The user manual. `reference/Package.md` for `build.config.mjs`, `reference/Services.md` for services, `internals/` for the service layer, the React integration and the build process. Fetch it from GitHub; it is not part of this repository. |
| `docs/agents/`                                            | Running one of the engineering skills. See [Agent skills](#agent-skills).                                                                                                                                                                       |

## Architecture

```
src/packages/<name>/   Published @open-pioneer/* packages, sources at the package root, tests next to the code
src/samples/           One directory per sample, built as the demo; src/index.html links the samples by hand
src/testing/           Vitest global setup and the private workspace package `test-utils` (disableReactActWarnings)
support/, patches/     Build scripts and the pnpm patches
```

The private `test-utils` under `src/testing/` and the published `@open-pioneer/test-utils` are different packages.

A Trails app is a web component.
`createCustomElement()` in `runtime` takes a React component and the app metadata from the virtual module
`open-pioneer:app`, which the Vite plugin generates from the `build.config.mjs` of every package in the dependency
graph.
Nothing in this repository writes that metadata by hand, except tests.
`AppInstance` merges the config, loads the messages, starts the service layer, renders the component into the shadow
root and assembles the web component API from the `integration.ApiExtension` services.
A failure in any step renders the `ErrorScreen` instead of the app.

The service layer starts only the required services: the UI references of every package, the builtins the runtime
needs, every `runtime.AutoStart` implementation, and their transitive dependencies.
A reference resolves by interface name plus optional qualifier to exactly one service, or to all implementations when
declared with `all: true`.
Missing, ambiguous, cyclic and undeclared dependencies are `Error`s with the `runtime:*` ids from `runtime/errors.ts`.

React code reaches services through the hooks of `open-pioneer:react-hooks`, generated per package.
The generated module calls `useServiceInternal(packageName, ...)` and its siblings in
`runtime/react-integration/hooks.ts`, which reject an interface the package did not declare under `ui.references`.
Those `*Internal` hooks are a public contract: packages compiled earlier import them by name from
`@open-pioneer/runtime/react-integration`, so their signatures stay stable.
The same holds for the `runtime` entry points `metadata/index` (build tooling) and `test-support/index`
(`@open-pioneer/test-utils`).

Mutable state lives in signals from `@conterra/reactivity-core`; React reads it through `useReactiveSnapshot()` from
`@open-pioneer/reactivity`.
Services receive the current `PackageIntl` as the `currentIntl` signal, so a locale change at runtime reaches them.

The Vite plugin and `build-pioneer-package` are developed in https://github.com/open-pioneer/trails-build-tools and
consumed here as npm dependencies.

## Commands

Most commands should be run from the workspace root:

- **Dev server**: `pnpm dev`. Vite's root is `src/`, so a sample is served at `/samples/<name>/`.
- **Lint**: `pnpm exec oxlint <path>`, or `pnpm lint`.
- **Format**: `pnpm exec oxfmt <path>`, or `pnpm fmt:check`.
- **Typecheck**: `pnpm check-types` (about 10 seconds).
- **Tests**: `pnpm exec vitest run src/packages/core/equal.test.ts`, `-t "name"` for one case, `-u` to update
  snapshots, no path for everything. `pnpm test` is watch mode.
- **Everything CI runs**: `pnpm ci:test`.
- **Package build**: `pnpm build-packages` (or `pnpm build` in the package directory) writes `dist/` for the packages.
  This command also performs advanced validation related to that package's dependencies, file setup, etc.
  Type checks and tests read the sources, so this is only needed to inspect the publishable output.

The pre-commit hook checks the lockfile, runs lint-staged, `pnpm check-types` and the tests affected by the change
with `CI=1`, which rejects `.only`.
`NO_VERIFY=1` skips it.

## Toolchain quirks

- **Chakra is pinned and updated by hand.**
  `@chakra-ui/react`, `@ark-ui/react` and `@zag-js/interact-outside` carry patches, so `pnpm-workspace.yaml` pins
  their exact versions and `renovate.json` excludes the Chakra and Ark packages.
  `@zag-js/interact-outside` is only reachable through the pnpm override.
  A Chakra update means re-checking the patches.
- **`chakra-snippets` is vendored code.**
  Oxlint ignores it, local changes to a snippet are marked with comments, and `DEVNOTES.md` in the package describes
  the update procedure.
- **The Vite plugin is patched** so that the dev server does not pre-bundle `@open-pioneer/runtime`, which is developed
  here from source.
- **Dependency resolution prefers old versions** (`resolutionMode: lowest-direct`, three day `minimumReleaseAge`).
  Version bumps go through the catalog in `pnpm-workspace.yaml`.
  Renovate is used to perform most updates.
- **`pnpm install` fails on duplicate production dependencies** (`check-pnpm-duplicates`, config in
  `support/duplicate-packages.yaml`).

## Changesets

Every change to a published package that a consumer can notice gets a changeset under `.changeset/`.
The summary lands in the package's `CHANGELOG.md`, so write it for the consumer: name the interface, type or option
as the consumer sees it, and say what to do when an old name is deprecated.
Start a breaking change with `**Breaking:**`.
All `@open-pioneer/*` packages are one `fixed` group and share a version; samples and `src/testing/` are never
versioned.

## Code conventions

Oxlint and Oxfmt settle formatting and most style questions; run both on the files you changed.
The rules below are the ones they cannot check, or that you need before writing.

- Every `*.ts`, `*.tsx`, `*.js` and `*.mjs` file starts with this header, followed by a blank line:

    ```ts
    // SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
    // SPDX-License-Identifier: Apache-2.0
    ```

- **No `any` and no `!` outside tests**; use type guards.
  Functions take at most 4 parameters, an options object above that.
- **Log through `createLogger(sourceId)`** with `sourceId` from `open-pioneer:source-info`.
  `console` is allowed only in configs, samples, `src/testing`, `support` and tests.
  AbortErrors do not need to be logged in almost all circumstances (see `isAbortError` from `@open-pioneer/core`).
- **Use `#` for private fields and methods.**
- **Import other packages by name**, never through a relative path that leaves the package.
- **Primary exports at the top of a file**, helpers and supporting types below in the order a reader meets them.
- **A service has three parts in fixed places.**
  The interface `Foo` in `api.ts` extends `DeclaredService<"<short-name>.Foo">`, where the short name is the package
  name without the scope.
  The class `FooImpl` has its own file, is exported from `services.ts` and is registered under `services` in
  `build.config.mjs` with `provides: "<short-name>.Foo"`.
- **Everything exported from an entry point is public API.**
  TypeDoc renders it, so it carries a doc comment; `@internal` hides what must be exported for technical reasons.
- **Public API changes are additive.**
  Keep the old name working, mark it `@deprecated` with the alternative, warn at runtime with `deprecated()` from
  `core` where usage can be detected, and write a changeset.
  Removal happens in the next major release.
  Inside a package, a rename updates the callers and leaves no alias behind.
- **Hold state in signals** (`reactive()`, `computed()`) in private fields behind plain getters, so callers don't
  have to write excessive amounts of `.value`.
  Note that state that will not be used in a reactive context (UI, watching) does not need to be wrapped in a signal.
- **Anything that holds a watch handle, a listener or a child object is a `Resource`.**
  Implement `destroy()` and release with `destroyResource()` or `destroyResources()` from `core`.
- **Error ids are for packages with important error conditions.**
  Where code or logs need to tell errors apart, throw `new Error(id, text, { cause })` from `@open-pioneer/core`
  with a package-prefixed, kebab-case id such as `runtime:interface-not-found`; `runtime` collects its ids in the
  `ErrorId` enum.
  Everywhere else a plain `Error` with a clear message is fine.
- **User-visible text is translated.**
  React code calls `useIntl()` from `open-pioneer:react-hooks`, services read `currentIntl`, and every key exists in
  both `i18n/en.yaml` and `i18n/de.yaml` of the package.
- **A new sample needs a link in `src/index.html`.**

### Comments

Default to no comment; add one for the why a reader cannot see from the code, one line where one suffices.
Describe the system as it is now: no history, no former names, no commented-out code, no section banners.
When you change code, update or delete any comment it makes stale.
The exception is the published API: every symbol exported from an entry point keeps a doc comment, with an
`@example` where one helps, because TypeDoc and editor hovers show it without the code.

## Writing

Everything you write is read by a human: chat replies, commit messages, pull request text, changeset summaries,
Markdown, doc comments.
Agent documents (communication with subagents, `.scratch/<feature>/issues/*.md`, `.scratch/<feature>/map.md`) are
exempt from the style and layout rules.

Simple, technical English in American spelling.

- **Lead with the answer.**
  Say first, and plainly, what you could not verify; state what you verified as fact.
- **One idea per sentence, about 20 words.**
  Periods and commas; a second sentence instead of an em-dash, semicolon, colon or parentheses.
- **Established words only.**
  Use the words of `CONTEXT.md`, the code and the package READMEs, the same word for the same thing throughout.
- **Concrete over abstract.**
  Name the file, the function, the error, the number; active voice, present tense, named actor.
- **Report, do not narrate.**
  No "I'll now", "Let me", no openers, closers or summaries, no "Additionally".
- **Everyday vocabulary.**
  The sentence stands without load-bearing, robust, seamless, comprehensive, leverage, delve, crucial, "note that",
  "in practice".
- **Say what is.**
  State claims in the affirmative, without a "not X, but Y" frame, "precisely because" or rhetorical questions.
  Call something cheap, fast or rare only with a number behind it.
- **Prose by default.**
  A list only for parallel items, one or two sentences per bullet; bold at most the first words of a bullet; headers
  only above about 500 words; code, commands and error text in fenced blocks; no emoji.

Rendered prose, the Markdown in this repository and the `/** */` doc comments, has three more rules that Oxfmt does
not enforce:

- **One sentence per line.**
  A long sentence may wrap, but two sentences never share a line, so a review diff shows the sentence that changed.
- **A line stays within about 120 characters.**
  Overshoot rather than split a URL, a code span or a `{@link}`.
  In a doc comment this covers the description and every tag text, each sentence on its own `*` line.
- **Mark a gap as a gap.**
  An inline `TODO:` for an undecided detail, future tense for a planned part.

## Working in this repository

- **Be direct and critical.**
  If an approach is wrong, a request rests on a false premise, or a change will not do what the user expects, say so
  plainly, give the reason, and propose the alternative.
- **Report results as they are.**
  A failing test is reported as failing, with the output; unverified work is described as unverified.
- **Read the surrounding code before applying generic React or TypeScript patterns.**
  The `currentIntl` signal next to the deprecated `intl`, the `*Internal` hooks, the `DeclaredService` marker and the
  stateful `PackageRepr`/`ServiceRepr` classes look redundant from the outside and are not.
  "Simplifying" one of them changes behavior for every published package and app that depends on this one.
- **Prefer extending an existing helper** in `core`, `test-utils` or the package at hand over adding a parallel
  mechanism.
- **Make the change the task asks for.**
  Leave unrelated code, comments and formatting as they are; add a helper, option or generic parameter when a second
  caller needs it.
- **Parallel agent work goes in `.worktrees/<unit>`** (gitignored), created with `git worktree add`, never under
  `.claude/`.

## Keeping this guide current

If this guide, `CONTEXT.md`, a skill under `.claude/skills/` or a file under `docs/agents/` states something false,
fix it as part of the task and mention the change to the user.
Propose any other change, such as a new rule or a reworded convention, to the user instead of making it.

## Agent skills

Configuration for the agent workflow skills.
Each file below is the contract for one part of the workflow; read it before acting on the topic it covers.

### Issue tracker

Issues and specs for agent work are files under `.scratch/` in this repository.
The GitHub issues of `open-pioneer/trails-core-packages` are for people and stay untouched.
See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

The sources of truth for a task are the user's messages, the documentation and the code.
A ticket, plan or spec found in the tree is an unverified draft, usually from an earlier agent session.
Read one when the user or a skill points you to it; before relying on it, name it and confirm with the user that it
still holds.

### Triage labels

Triage state is a `Status:` line inside each issue file, using the five canonical role names plus `done`.
See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context layout: one `CONTEXT.md` at the repository root and decision records in `docs/adr/`.
Read `CONTEXT.md` before touching the code; it defines the project's words and the synonyms to avoid.
See [docs/agents/domain.md](docs/agents/domain.md).
