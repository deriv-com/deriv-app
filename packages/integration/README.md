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

## Local Mock

I've created an example `exampleMock.ts` file, that can be run with `ts-node ./exampleMock.ts` to start a web socket server on `localhost:10443`

## Using mocks in tests

Each test should setup the mocks they need from the pool of mocks provided.

```js
import { test, expect } from '@playwright/test';
import setupMocks from '../../utils/mocks/mocks';
import mockGeneral from '../../mocks/general';
import mockLoggedIn from '../../mocks/auth';

test('it shows the first name when logged in', async ({ page, baseURL }) => {
    await setupMocks({
        baseURL,
        page,
        mocks: [mockGeneral, mockLoggedIn],
    });
    await page.goto(`${baseURL}/app-store/traders-hub`);

    const firstName = await page.getByRole('button', { name: 'User Menu' }).first();
    expect(await firstName.inputValue()).toBeVisible();
});
```

## Writing your own mocks

A mock is simply a function that is given a context object that contains the following keys:

-   req_id
-   request
-   response

```js
export default function customTimeMock(context) {
    if (context.request.time === 1) {
        context.response = {
            echo_req: context.request,
            req_id: context.req_id,
            msg_type: 'time',
            time: (Date.now() / 1000).toFixed(0),
        };
    }
}

// Then add it to your mocks:
await setupMocks({
    baseURL,
    page,
    mocks: [mockGeneral, mockLoggedIn, customTimeMock],
});
```

## Extending Mocks

If you want to change how a base mock works, or "extend" a mock, you can use the middleware like approach.

For example, let's say you want to add a `day` to the `time` endpoint. You can use the `mockTime` base mock, but add another mock to add the `day` key.

```js
export default function mockTimeMonday(context) {
    if (context.request.time === 1) {
        context.response.day = 'Monday';
    }
}

await setupMocks({
    baseURL,
    page,
    mocks: [mockTime, mockTimeMonday],
});
```

**| Note:** The response will, by default, be undefined. Above, mockTime creates the first response, then mockTimeMonday get's the mutated response and adds a new key. For that reason, the order of mocks is important.

## Dynamically changing

If you have a test that needs to change a mock, in the middle of the run, you can use the `add` and `remove` functions returned from `createMockServer`

```js
const mocks = await setupMocks({
    baseURL,
    page,
    mocks: [mockGeneral, mockLoggedIn],
});

mocks.remove(mockLoggedIn);
mocks.add(mockHelloWorld);
```
