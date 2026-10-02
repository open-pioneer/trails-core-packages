---
name: test
description: Write, run and fix the Vitest tests of this repository. Use when adding a test case, testing a service, a React component or the web component itself, waiting for reactive state, or updating a snapshot.
---

# Tests

Every test runs with Vitest in `happy-dom`, configured inline in `vite.config.ts` with `root: src`.
A test file is `<source-file-name>.test.ts` or `.tsx` next to its source; snapshots go to `__snapshots__/` beside it.
Run from the repository root: `pnpm exec vitest run src/packages/<package>/<File>.test.ts`, add `-t "name"` for one
case and `-u` to update snapshots.
`CI=1` rejects `.only`, and the pre-commit hook runs with it.

## Pick the level

- **Plain unit test** for a function or class that takes values and returns values.
  `core/equal.test.ts` and `runtime/i18n/pick.test.ts` are the examples.
  Start the file with a `@vitest-environment node` comment only when the code does not need the DOM.
- **Service test** for a service class.
  Construct it with `createService(Impl, { references, properties, messages })` from
  `@open-pioneer/test-utils/services` and pass plain objects as references.
  The types enforce that a reference is a `Partial<>` of the real interface; cast only when you mean to.
  `http/HttpServiceImpl.test.ts` and `authentication/AuthServiceImpl.test.ts` are the examples.
- **Component test** for a React component or hook.
  Render with `render` from `@testing-library/react` inside `<PackageContextProvider services={...} properties={...}
messages={...}>` from `@open-pioneer/test-utils/react`, so `useService`, `useProperties` and `useIntl` work.
  `notifier/Notifier.test.tsx` and `react-utils/TitledSection.test.tsx` are the examples.
- **Web component test** for the runtime itself.
  Define an element with `createCustomElement()`, render it with `renderComponentShadowDOM()` from
  `@open-pioneer/test-utils/web-components`, and query through the returned `queries`, which are bound to the
  `.pioneer-root` inside the shadow root.
  `runtime/CustomElement.test.ts` and `test-utils/web-components.test.ts` are the examples.
- **Service layer test** for `runtime/service-layer`.
  Build `PackageRepr` and `ServiceRepr` objects by hand with the factories from `ServiceRepr.ts`; the metadata is
  never generated here.
  `runtime/service-layer/ServiceLayer.test.ts` is the example.

Pick the cheapest level that can fail for the reason you care about.

## Names and layout

Name an `it()` case after the behavior, as a plain verb phrase: `"transports request errors"`,
`"starts and stops services in the expected order"`.
Many older cases start with "should"; leave those names as they are instead of renaming them.

Write top-level `it()` cases and use `describe()` only to group closely related cases.
Test cases come first, and the `setup()`, `create()` or `createIntegration()` helper that builds the subject goes to
the bottom of the file.

## Helpers

- `createIntl({ locale, messages })` from `@open-pioneer/test-utils/vanilla` gives a `PackageIntl` for code that
  formats messages outside React.
- `disableReactActWarnings()` from the private workspace package `test-utils` silences React's `act()` warnings for
  the current test only.
  Reach for it after trying to wrap the state change in `act()`.
- `expectError()` and `expectAsyncError()` in `runtime/test-utils/expectError.ts` return the thrown error for
  inspection of its `id` or `cause`.
- `src/testing/global-setup.ts` already registers the jest-dom matchers (`toHaveStyle`, `toBeVisible`, ...) and a
  `ResizeObserver` polyfill.

## Waiting for async state

Reactive updates from `@conterra/reactivity-core` and React renders arrive asynchronously.

- A DOM element that will appear: `await screen.findByText(...)` or `await findByTestId(container, ...)`, which retry.
- A DOM element that will disappear: `await waitForElementToBeRemoved(element)`.
- A value with no DOM: `await vi.waitFor(() => { if (!condition) throw new Error("not yet"); })`, or
  `await vi.waitUntil(() => value)` to capture the settled value.
- A state change that React must observe: wrap the call in `act(() => { ... })`.
- Code that uses timers internally: `vi.useFakeTimers()` with `vi.advanceTimersByTime()`, restored in `afterEach`
  with `vi.useRealTimers()`.

Never pause with `setTimeout`; a fixed delay is flaky and hides the real timing problem.

## Assertions

- Rendered markup or a serialized object: `toMatchInlineSnapshot()` for small values, `toMatchSnapshot()` for larger
  markup that lands in `__snapshots__/`.
  Review a snapshot diff before accepting it; the markup of a Chakra component changes with Chakra updates and a
  `-u` run accepts whatever is rendered.
- An error a user should read: `await expect(promise).rejects.toThrow(/message/)`, or `expectError()` when the `id`
  or the `cause` chain matters.
- A `fetch` call: replace `window.fetch` with a `vi.fn()` through `vi.spyOn(window, "fetch", "get")` and inspect the
  `Request` it received, as `http/HttpServiceImpl.test.ts` does; restore mocks in `afterEach` with
  `vi.restoreAllMocks()`.
- Translated text: pass `messages` to `PackageContextProvider` or `createService` and assert the formatted string,
  instead of asserting message ids.

## Checks before you finish

Run the test file, then `pnpm exec oxlint <path>` and `pnpm check-types`.
Test files may use `!` and `any`, everything else in the lint config applies to them too, including the SPDX header.
