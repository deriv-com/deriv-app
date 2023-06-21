import { Page, expect, chromium } from '@playwright/test';
import { suspend } from '../../utils';
import ChangeEndpoint from '../change-endpoint/change-endpoint';

export default class OnboardingFlow {
    readonly page: Page;
    readonly ChangeEndpoint: ChangeEndpoint;
    readonly email: string;
    private signupPage: Page | null;

    constructor(page: Page) {
        const randomString = new Date().getTime();
        this.page = page;
        this.email = `deriv-fe-e2e-${randomString}@deriv.com`;
        this.signupPage = null;
        this.ChangeEndpoint = new ChangeEndpoint(page);
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
        await suspend(1000);
    }
    async demoWizardHandler() {
        await this.page.locator('.static-dashboard-wrapper__header > h2', { hasText: 'CFDs' });
        await this.page.locator('.static-dashboard-wrapper__header > h2', { hasText: 'Multipliers' });
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
        await this.page.locator('button[type="submit"]', { hasText: 'Next' }).click();
    }
    async signUp() {
        await this.ChangeEndpoint.changeEndpoint();
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
                const element = await mailPage.locator('a', { hasText: 'redirect?action=signup' });
                const val = await element.getAttribute('href');
                if (val) await this.page.goto(val);
                await mailPage.close();
                await this.signupPage.close();
                break;
            }
        }

        this.page.waitForSelector('#dt_core_set-residence-form_signup-residence-select').then(async () => {
            await this.page.click('#dt_core_set-residence-form_signup-residence-select');
        });

        const RISK_LEVEL = process.env.RISK_LEVEL;

        const ACCOUNT_CITIZENSHIP =
            (RISK_LEVEL === 'low_risk'
                ? process.env.ACCOUNT_CITIZENSHIP_LOW_RISK
                : process.env.ACCOUNT_CITIZENSHIP_HIGH_RISK) || '';

        const ACCOUNT_RESIDENCE =
            (RISK_LEVEL === 'low_risk'
                ? process.env.ACCOUNT_RESIDENCE_LOW_RISK
                : process.env.ACCOUNT_RESIDENCE_HIGH_RISK) || '';

        await expect(this.page.getByText(ACCOUNT_RESIDENCE)).toBeVisible();
        await this.page.getByText(ACCOUNT_RESIDENCE).click();
        await this.page.click('#dt_core_set-citizenship-form_signup-citizenship-select');
        await expect(this.page.getByText(ACCOUNT_CITIZENSHIP)).toBeVisible();
        await this.page.getByText(ACCOUNT_CITIZENSHIP).click();
        await this.page.getByRole('dialog').getByRole('button', { name: 'Next' }).click();
        await expect(this.page.getByText(/Keep your account secure/)).toBeVisible();
        await this.page.locator('#dt_core_account-signup-modal_account-signup-password-field');
        await expect(this.page.getByText(/Start trading/)).toBeDisabled();
        await this.page.locator('#dt_core_account-signup-modal_account-signup-password-field').type('Abcd2134');
        await expect(this.page.getByText(/Start trading/)).toBeEnabled();
        await this.page.getByText(/Start trading/).click();
        if (this.page.url().includes('onboarding')) await this.demoWizardHandler();
    }
}
