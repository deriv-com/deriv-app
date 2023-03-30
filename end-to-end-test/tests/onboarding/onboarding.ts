import { Page, expect, chromium } from '@playwright/test';
import suspend from '../../utils/suspend/suspend';

export default class OnboardingFlow {
    readonly page: Page;
    readonly email: string;
    private signupPage: Page | null;

    constructor(page: Page) {
        const randomString = new Date().getTime();
        this.page = page;
        this.email = `deriv-fe-e2e-${randomString}@deriv.com`;
        this.signupPage = null;
    }

    async changeEndpoint() {
        await this.page.goto(process.env.APP_URL!);
        await expect(this.page).toHaveTitle('Trader | Deriv');
        await this.cookieDialogHandler();
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
        if (
            !(await this.page.locator("input[name='is_appstore_enabled']").isChecked()) &&
            process.env.ENDPOINT_PAGE_APP_STORE === 'true'
        ) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(4) > .dc-checkbox > .dc-checkbox__box');
        }
        if (
            !(await this.page.locator("input[name='show_dbot_dashboard']").isChecked()) &&
            process.env.ENDPOINT_PAGE_DBOT_DASHBOARD === 'true'
        ) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(5) > .dc-checkbox > .dc-checkbox__box');
        }
        if (
            !(await this.page.locator("input[name='is_debug_service_worker_enabled']").isChecked()) &&
            process.env.ENDPOINT_PAGE_DEBUG_SERVICE_WORKER === 'true'
        ) {
            await this.page.click('.dc-themed-scrollbars > form > div:nth-child(6) > .dc-checkbox > .dc-checkbox__box');
        }

        await this.page.waitForSelector('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
        await this.page.click('#deriv_app > #app_contents > .dc-themed-scrollbars > form > .dc-btn--primary');
    }

    async updateServerURLAndAppIDInLocalStorage() {
        const server = process.env.ENDPOINT;
        const app_id = process.env.APPID;
        await this?.signupPage?.evaluate(`localStorage.setItem('config.server_url', '${server}');`);
        await this?.signupPage?.evaluate(`localStorage.setItem('config.app_id', '${app_id}');`);
        await this?.signupPage?.evaluate(`window.location.reload();`);
        const server_url = await this?.signupPage?.evaluate(() => {
            const result = localStorage.getItem('config.server_url');
            return Promise.resolve(result);
        });
        expect(server_url).toBe(process.env.ENDPOINT);
        await suspend(10000);
    }
    async demoWizardHandler() {
        await this.page.locator('.static-dashboard-wrapper__header > h2', { hasText: 'CFDs' });
        await this.page.locator('.static-dashboard-wrapper__header > h2', { hasText: 'Multipliers' });
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
    }
    async cookieDialogHandler() {
        if (this.page.locator('.cookie-banner'))
            await this.page.locator('.cookie-banner > button[type=submit]', { hasText: /Accept/ }).click();
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
        await suspend(10000);
        await this.updateServerURLAndAppIDInLocalStorage();
        await this.signupPage.waitForLoadState();
        await this.signupPage.locator('input[name=email]#dm-email-input').isVisible();
        await this.signupPage.locator('input[name=email]#dm-email-input').type(this.email);
        process.env.email = this.email;
        await this.signupPage.locator('//*[@id="gatsby-focus-wrapper"]/main/section/form/div/label/div');
        await this.signupPage.locator('//*[@id="gatsby-focus-wrapper"]/main/section/form/div/label/div').click();
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
            return Array.from(document.links)
                .filter(item => item.href.endsWith('_account_opening_new.html'))
                .map(item => item.href);
        });
        hrefs = hrefs.slice().reverse();
        // TODO need to find a better approach instead of this
        // eslint-disable-next-line no-restricted-syntax
        for await (const item of hrefs) {
            await mailPage.goto(item);
            if (await mailPage.getByText(this.email).isVisible()) {
                const element = await mailPage.locator('a', { hasText: 'signup' });
                const val = await element.getAttribute('href');
                if (val) await this.page.goto(val);
                await mailPage.close();
                await this.signupPage.close();
                break;
            }
        }
        await this.page.waitForSelector('#dt_core_set-residence-form_signup-residence-select');
        await this.page.click('#dt_core_set-residence-form_signup-residence-select');
        await expect(this.page.getByText(process.env.ACCOUNT_RESIDENCE!)).toBeVisible();
        await this.page.getByText(process.env.ACCOUNT_RESIDENCE!).click();
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
        if (this.page.url().includes('onboarding')) await this.demoWizardHandler();
    }
}
