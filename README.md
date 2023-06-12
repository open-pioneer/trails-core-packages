# Core packages

Core packages of the open pioneer client framework.

[Samples](https://open-pioneer.github.io/demo/core-packages/) | [API Documentation](https://open-pioneer.github.io/demo/core-packages/docs/) | [User manual](https://github.com/open-pioneer/starter/tree/main/docs)

## Getting started

Requirements: Node >= 16, pnpm >= 8.

To start the development server, run:

```bash
$ pnpm install # initially and always after changing package dependencies
$ pnpm dev      # starts dev server
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

For more details, consult the starter project's [Repository Guide](https://github.com/open-pioneer/starter/blob/main/docs/RepositoryGuide.md).

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
