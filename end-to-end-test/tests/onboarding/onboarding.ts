import { Page, expect, chromium } from '@playwright/test';

const randomString = new Date().getTime();
const suspend = (value: number) => new Promise(resolve => setTimeout(resolve, value));

export default class OnboardingFlow {
    readonly page: Page;
    readonly email: string;
    private signupPage: Page | null;

    constructor(page: Page) {
        this.page = page;
        this.email = `deriv-fe-e2e-${randomString}@deriv.com`;
        this.signupPage = null;
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
            localStorage.setItem('config.server_url', '${server}');
            localStorage.setItem('config.app_id', '${app_id}');
            window.location.reload();
        `;
        await this?.signupPage?.evaluate(SET_SCRIPT);
        const server_url = await this?.signupPage?.evaluate(() => {
            const result = localStorage.getItem('config.server_url');
            return Promise.resolve(result);
        });
        expect(server_url).toBe(process.env.ENDPOINT);
        await suspend(10000);
    }
    async signUp() {
        await this.changeEndpoint();
        await this.page.goto(process.env.APP_URL!);
        await this.page.waitForSelector('#dt_signup_button');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'), // get `context` by destructuring with `page` in the test params; 'page' is a built-in event, and **you must wait for this like this,**, or `newPage` will just be the response object, rather than an actual Playwright page object.
            await this.page.click('#dt_signup_button'),
        ]);
        this.signupPage = newPage;
        // await this.page.waitForNavigation({ url: '**/signup' });
        await suspend(15000);
        await this.connectToQALocalStorage();
        // await expect(this.page.getByText(/Sign up/)).toBeVisible();
        await this.signupPage.waitForLoadState();
        await this.signupPage.locator('input[name=email]#dm-email-input').isVisible();
        await this.signupPage.locator('input[name=email]#dm-email-input').type(this.email);
        await this.signupPage.waitForSelector(
            '.signup__Form-sc-1bdbun8-1 > ._signup-new__SignupContent-sc-1f1r3le-0 > label > .checkbox__CheckboxContainer-sc-r1zf4m-0 > .checkbox__StyledCheckbox-sc-r1zf4m-3'
        );
        await this.signupPage.click(
            '.signup__Form-sc-1bdbun8-1 > ._signup-new__SignupContent-sc-1f1r3le-0 > label > .checkbox__CheckboxContainer-sc-r1zf4m-0 > .checkbox__StyledCheckbox-sc-r1zf4m-3'
        );
        await this.signupPage.waitForSelector('#dm-new-signup');
        await this.signupPage.click('#dm-new-signup');
        const browser = await chromium.launch();
        const mailPage = await browser.newPage({
            ignoreHTTPSErrors: true,
            httpCredentials: {
                username: `${process.env.QA_EMAIL_INBOX_USER_NAME}`,
                password: `${process.env.QA_EMAIL_INBOX_PASSWORD}`,
            },
        });
        await mailPage.goto(`https://${process.env.ENDPOINT!}/events`);
        let hrefs = await mailPage.evaluate(() => {
            return Array.from(document.links).map(item => item.href);
        });
        hrefs = hrefs.slice().reverse();
        // eslint-disable-next-line no-restricted-syntax
        for await (const item of hrefs) {
            await mailPage.goto(item);
            if (await mailPage.getByText(this.email).isVisible()) {
                const val = (await mailPage.locator('a', { hasText: 'signup' }).innerText()).valueOf();
                if (val) await this.page.goto(val);
                await mailPage.close();
                await this.signupPage.close();
                break;
            }
        }
        await this.page.locator('#dt_core_set-residence-form_signup-residence-select');
        await this.page.click('#dt_core_set-residence-form_signup-residence-select');
        await expect(this.page.getByText(/Germany/)).toBeVisible();
        await this.page.getByText(/Germany/).click();
        await this.page.getByRole('dialog').getByRole('button', { name: 'Next' }).click();
        await expect(this.page.getByText(/Citizenship/)).toBeVisible();
        await expect(this.page.getByText(/Are you a citizen of/)).toBeVisible();
        await this.page.getByText(/Yes/).click();
        await expect(this.page.getByText(/Keep your account secure/)).toBeVisible();
        await this.page.locator('#dt_core_account-signup-modal_account-signup-password-field');
        await expect(this.page.getByText(/Start trading/)).toBeDisabled();
        await this.page.locator('#dt_core_account-signup-modal_account-signup-password-field').type('Abcd2134');
        await expect(this.page.getByText(/Start trading/)).toBeEnabled();
        await this.page.getByText(/Start trading/).click();
        // await suspend(50000);
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
