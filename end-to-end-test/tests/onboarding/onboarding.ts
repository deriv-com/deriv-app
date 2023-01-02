import { Page, expect } from '@playwright/test';

const randomString = new Date().getTime();
export default class OnboardingFlow {
    readonly page: Page;
    readonly email: string;

    constructor(page: Page) {
        this.page = page;
        this.email = `${randomString}@deriv.com`;
    }

    async changeEndpoint() {
        await this.page.goto(process.env.APP_URL!);
        await expect(this.page).toHaveTitle('Trader | Deriv');
        await this.page.goto(`${process.env.APP_URL!}/endpoint`);

        await this.page.waitForSelector(
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field'
        );
        await this.page.click(
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field'
        );

        await this.page.waitForSelector(
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field'
        );
        await this.page.click(
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field'
        );

        await this.page.waitForSelector(
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field'
        );
        const first_input_selector =
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(2) > .dc-input__field';
        await this.page.click(first_input_selector, { clickCount: 3 });
        await this.page.keyboard.press('Backspace');

        await this.page.click(first_input_selector);

        await this.page.type(first_input_selector, process.env.ENDPOINT!);
        const second_input_selector =
            '#app_contents > .dc-themed-scrollbars > form > .dc-input:nth-child(3) > .dc-input__field';
        await this.page.click(second_input_selector, { clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await this.page.type(second_input_selector, process.env.APPID!);

        // await this.page.getByRole('checkbox', { name: 'is_appstore_enabled' }).check();

        if (await this.page.locator("input[name='is_appstore_enabled']").isChecked()) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='is_pre_appstore_enabled']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(5) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='show_dbot_dashboard']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(6) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='is_debug_service_worker_enabled']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(7) > .dc-checkbox > .dc-checkbox__box');
        }

        await this.page.waitForSelector('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
        await this.page.click('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
    }
    async loadLoginPage() {
        await this.changeEndpoint();
        await this.page.waitForSelector('#dt_login_button');

        await this.page.click('#dt_login_button');
        await expect(this.page).toHaveURL(new RegExp(`^https://oauth.deriv.com/[a-zA-Z]*`));
    }

    async connectToQALocalStorage() {
        const server = process.env.ENDPOINT;
        const app_id = process.env.APPID;
        const SET_SCRIPT = `
            localStorage.setItem('config.server_url', "${server}");
            localStorage.setItem('config.app_id', "${app_id}");
        `;
        await this.page.evaluate(SET_SCRIPT);
        const server_url = await this.page.evaluate(() => {
            const result = localStorage.getItem('config.server_url');
            return Promise.resolve(result);
        });
        expect(server_url).toBe(process.env.ENDPOINT);
        await this.page.waitForLoadState('domcontentloaded');
    }
    async signUp() {
        await this.changeEndpoint();
        await this.page.goto(process.env.APP_URL!);
        await this.page.waitForSelector('#dt_signup_button');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'), // get `context` by destructuring with `page` in the test params; 'page' is a built-in event, and **you must wait for this like this,**, or `newPage` will just be the response object, rather than an actual Playwright page object.
            await this.page.click('#dt_signup_button'),
        ]);
        // await this.page.waitForNavigation({ url: '**/signup' });
        const suspend = (value: number) => new Promise(resolve => setTimeout(resolve, value));
        await suspend(10000);
        await this.connectToQALocalStorage();
        // await expect(this.page.getByText(/Sign up/)).toBeVisible();
        await newPage.waitForLoadState();
        await newPage.locator('input[name=email]#dm-email-input').isVisible();
        await newPage.locator('input[name=email]#dm-email-input').type(this.email);
        await newPage.waitForSelector(
            '.signup__Form-sc-1bdbun8-1 > ._signup-new__SignupContent-sc-1f1r3le-0 > label > .checkbox__CheckboxContainer-sc-r1zf4m-0 > .checkbox__StyledCheckbox-sc-r1zf4m-3'
        );
        await newPage.click(
            '.signup__Form-sc-1bdbun8-1 > ._signup-new__SignupContent-sc-1f1r3le-0 > label > .checkbox__CheckboxContainer-sc-r1zf4m-0 > .checkbox__StyledCheckbox-sc-r1zf4m-3'
        );
        await newPage.waitForSelector('#dm-new-signup');
        await newPage.click('#dm-new-signup');
    }
    // async logIn() {
    //     const { page } = this;
    //     await this.loadLogInPage();
    //     await page.waitForSelector('#txtEmail');
    //     await page.click('#txtEmail');
    //     await page.type('#txtEmail', 'aaaaa');
    //     await page.type('#txtPass', 'aaaaa');
    //     await page.waitForSelector('.oauth > #container > #frmLogin > #lost-password-container > .button');
    //     await page.click('.oauth > #container > #frmLogin > #lost-password-container > .button');
    // }
}
