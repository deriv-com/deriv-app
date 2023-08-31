# @deriv/integration

This package contains the global files and mocked data for writing your integration tests in the deriv projects, you can easily install this package and use these data inside your tests.

It uses [playwright](https://playwright.dev/) as its main framework and you can simply write test with it.
We strongly suggest you to read the [documentation](https://playwright.dev/docs/intro) of playwright once before you get started.

## Run tests

-   You can run your tests with UI Mode for a better developer experience with time travel debugging, watch mode and more.

```
npx playwright test --ui
```

-   Running all tests

```
npx playwright test
```

-   Running a single test file

```
npx playwright test landing-page.spec.ts
```

-   Run a set of test files

```
npx playwright test tests/todo-page/ tests/landing-page/
```

-   Run files that have landing or login in the file name

```
npx playwright test landing login
```

-   Run the test with the title

```
npx playwright test -g "add a todo item"
```

-   Running tests in headed mode

```
npx playwright test landing-page.spec.ts --headed
```

-   Running tests on a specific project

```
npx playwright test landing-page.ts --project=chromium
```

## Debugging Tests

-   Debugging all tests:

```
npx playwright test --debug
```

-   Debugging one test file:

```
npx playwright test example.spec.ts --debug
```

-   Debugging a test from the line number where the test(.. is defined:

```
npx playwright test example.spec.ts:10 --debug
```
