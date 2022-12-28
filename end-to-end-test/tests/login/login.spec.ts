import { Page, expect } from '@playwright/test';

export default class LoginFlow {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async changeEndpoint() {
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

        if (!(await this.page.locator("input[name='is_appstore_enabled']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='is_pre_appstore_enabled']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='show_dbot_dashboard']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }
        if (!(await this.page.locator("input[name='is_debug_service_worker_enabled']").isChecked())) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }

        await this.page.waitForSelector('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
        await this.page.click('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
    }
    async goToHome() {
        await this.page.goto(process.env.APP_URL!);
        await expect(this.page).toHaveTitle('Trader | Deriv');
        await this.changeEndpoint();
    }
    async loadLogInPage() {
        await this.goToHome();
        await this.page.waitForSelector('#dt_login_button');

        await this.page.click('#dt_login_button');
        await expect(this.page).toHaveURL(new RegExp(`^https://oauth.deriv.com/[a-zA-Z]*`));
    }
    async loadSignUpPage() {
        await this.goToHome();
        await this.page.waitForSelector('#dt_signup_button');
        await this.page.click('#dt_signup_button');
        await expect(this.page.getByText('Sign Up')).toBeVisible();
    }
    async logIn() {
        const { page } = this;
        await this.loadLogInPage();
        await page.waitForSelector('#txtEmail');
        await page.click('#txtEmail');
        await page.type('#txtEmail', 'aaaaa');
        await page.type('#txtPass', 'aaaaa');
        await page.waitForSelector('.oauth > #container > #frmLogin > #lost-password-container > .button');
        await page.click('.oauth > #container > #frmLogin > #lost-password-container > .button');
    }
    async signUp() {
        await this.loadSignUpPage();
    }
}
