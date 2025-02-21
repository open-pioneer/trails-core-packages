[![Build and deploy](https://github.com/open-pioneer/trails-core-packages/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/open-pioneer/trails-core-packages/actions/workflows/test-and-build.yml)
[![Audit dependencies (daily)](https://github.com/open-pioneer/trails-core-packages/actions/workflows/audit-dependencies.yml/badge.svg)](https://github.com/open-pioneer/trails-core-packages/actions/workflows/audit-dependencies.yml)

# Core packages

Core packages of the Open Pioneer Trails client framework.

[Samples](https://open-pioneer.github.io/trails-demo/core-packages/) | [API Documentation](https://open-pioneer.github.io/trails-demo/core-packages/docs/) | [User manual](https://github.com/open-pioneer/trails-starter/tree/main/docs)

## Getting started

Requirements: Node >= 20, pnpm >= 9.

To start the development server, run:

```bash
$ pnpm install # initially and always after changing package dependencies
$ pnpm dev     # starts dev server
  VITE v4.3.9  ready in 832 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

To run tests:

```bash
# all tests
$ pnpm test
# only run certain tests, only core packages in this case (also see vitest docs)
$ pnpm test ./src/packages/core
```

For more details, consult the starter project's [Repository Guide](https://github.com/open-pioneer/trails-starter/blob/main/docs/RepositoryGuide.md).

## Packages

This repository publishes the following packages:

<!--
  List packages:

  $ pnpm ls -r --depth -1 --json | jq ".[].name"

  NPM badges: See https://shields.io/badges/npm-version
-->

| Name                                                                             | Version                                                                                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@open-pioneer/authentication](./src/packages/authentication/)                   | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fauthentication)](https://www.npmjs.com/package/@open-pioneer/authentication)                   |
| [@open-pioneer/authentication-keycloak](./src/packages/authentication-keycloak/) | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fauthentication-keycloak)](https://www.npmjs.com/package/@open-pioneer/authentication-keycloak) |
| [@open-pioneer/base-theme](./src/packages/base-theme/)                           | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fbase-theme)](https://www.npmjs.com/package/@open-pioneer/base-theme)                           |
| [@open-pioneer/chakra-integration](./src/packages/chakra-integration/)           | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fchakra-integration)](https://www.npmjs.com/package/@open-pioneer/chakra-integration)           |
| [@open-pioneer/core](./src/packages/core)                                        | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fcore)](https://www.npmjs.com/package/@open-pioneer/core)                                       |
| [@open-pioneer/http](./src/packages/http)                                        | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fhttp)](https://www.npmjs.com/package/@open-pioneer/http)                                       |
| [@open-pioneer/integration](./src/packages/integration/)                         | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fintegration)](https://www.npmjs.com/package/@open-pioneer/integration)                         |
| [@open-pioneer/local-storage](./src/packages/local-storage/)                     | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Flocal-storage)](https://www.npmjs.com/package/@open-pioneer/local-storage)                     |
| [@open-pioneer/notifier](./src/packages/notifier)                                | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fnotifier)](https://www.npmjs.com/package/@open-pioneer/notifier)                               |
| [@open-pioneer/react-utils](./src/packages/react-utils/)                         | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Freact-utils)](https://www.npmjs.com/package/@open-pioneer/react-utils)                         |
| [@open-pioneer/reactivity](./src/packages/reactivity/)                           | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Freactivity)](https://www.npmjs.com/package/@open-pioneer/reactivity)                           |
| [@open-pioneer/runtime](./src/packages/runtime/)                                 | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fruntime)](https://www.npmjs.com/package/@open-pioneer/runtime)                                 |
| [@open-pioneer/runtime-react-support](./src/packages/runtime-react-support/)     | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Fruntime-react-support)](https://www.npmjs.com/package/@open-pioneer/runtime-react-support)     |
| [@open-pioneer/test-utils](./src/packages/test-utils/)                           | [![NPM Version](https://img.shields.io/npm/v/%40open-pioneer%2Ftest-utils)](https://www.npmjs.com/package/@open-pioneer/test-utils)                           |

## License

Apache-2.0 (see `LICENSE` file)
