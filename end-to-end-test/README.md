# Deriv App End to End test

This directory is just to implement and run the E2E tests over the app.

This uses [playwright](https://playwright.dev/) as its main framework and you can simply write test with it.
We strongly suggest you to read the [documentation](https://playwright.dev/docs/intro) of playwright once before you get started.

## Run the test cases

To run the End to End test you need to first install playwright on your machine using:

`npx install playwright` to install the dependencies on your machine.

then

`npx plauwright test` to start the tests to run. (You also can pass `--debug` option to this command to it to run them in headless browser and check them visually separated by different browsers eg. Chromium, Firefox or Edge)

## Project structure

### `.env` file

It's mandatory to create this file to pass the needed environment variables to the framework to run the tests. The defined variables are these

| #   | Env Variable Name                    | Functionality                                                                                                                                                                           | Type    | Required |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| 1   | `ENDPOINT_PAGE_APP_STORE`            | This variable enables the AppStore in the `AppURL/endpoint` page                                                                                                                        | Boolean |          |
| 2   | `ENDPOINT_PAGE_DBOT_DASHBOARD`       | enables the DBot dashboard in the `AppURL/endpoint` page                                                                                                                                | Boolean |          |
| 3   | `ENDPOINT_PAGE_DEBUG_SERVICE_WORKER` | enables the Debug service worker in the `AppURL/endpoint` page                                                                                                                          | Boolean |          |
| 4   | `APPID`                              | App ID of the qabox that we want to test with, On local machine it should be `9999` to redirect to localhost.binary.sx after sign up(Company convention)                                | Number  | \*       |
| 5   | `ENDPOINT`                           | Endpoint of qabox server                                                                                                                                                                | String  | \*       |
| 6   | `APP_URL`                            | App URL which tests should run on. Local machine URL is `localhost.binary.sx`                                                                                                           | String  | \*       |
| 7   | `QA_EMAIL_INBOX_USER_NAME`           | Username of qabox events page to retrive the signup email and enable the created account (You can find it in the LP under shared-fe folder with the `QA emails login creds` entry name) | String  | \*       |
| 8   | QA_EMAIL_INBOX_PASSWORD              | Password of qabox events page to retrive the signup email and enable the created account (You can find it in the LP under shared-fe folder with the `QA emails login creds` entry name) | String  | \*       |
| 9   | ACCOUNT_RESIDENCE                    | Account residence to create account using it                                                                                                                                            | String  | \*       |

### `onboarding.ts` file

This is the main components which runs before any test suit runs, the main goal of this is to create one account for all of the test cases, save it to a context and use the created context in all of the browsers and before all of the test cases start to run.
`global-setup.ts` runs the mentioned onboarding flow and save the state. Refer to `globalSetup` option in `plauwright.config.ts` to see how its bound to the app.

So in each test suit that you want to write you need to worry that if you are logged in or not. You just need to get the page from `describe` method like below:

```
import { test, expect } from '@playwright/test';

test.describe('Change endpoint, Signup and login', () => {
    test('Should change the endpoint and sign up', async ({ page }) => {
        await page.goto(process.env.APP_URL!);
        // now we are logged in to the app and ready to test. YAY!
        await expect(page).toHaveTitle('Trader | Deriv');
        // created a new user account and logged in
        // Also you can get access to created email account name using `process.env.email`
    });
});
```
