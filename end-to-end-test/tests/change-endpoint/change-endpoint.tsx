import { expect, Page } from '@playwright/test';

export default class ChangeEndpoint {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async cookieDialogHandler() {
        const elem = this.page.locator('.cookie-banner');
        if (await elem.isVisible())
            await this.page.locator('.cookie-banner > button[type=submit]', { hasText: /Accept/ }).click();
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
}
