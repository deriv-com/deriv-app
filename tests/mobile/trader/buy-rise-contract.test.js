const {waitForPurchaseBtnEnabled} = require("../../_common/contract_tasks");
const {
    waitForChart,
} = require("../../_common/contract_tasks");

const {loadOrLogin} = require("../../_utils/page");
const {setUp, tearDown} = require('../../bootstrap');

let browser, context, page;

beforeAll(async () => {
    const out = await setUp({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            'width': 375,
            'height': 667,
        },
        deviceScaleFactor: 2,
        hasTouch: true,
        defaultBrowserType: 'webkit',
    });
    browser = out.browser;
    context = out.context;
});

afterAll(async () => {
    await tearDown(browser);
});

beforeEach(async () => {
    page = await context.newPage();
    await preBuy();
});

test("[mobile] trader/buy-rise-contract", async () => {
    await page.click("#dt_purchase_call_price");
    await page.waitForTimeout(5000);
});
test('[mobile] trader/buy-rise-contract-min-duration', async () => {
    await page.waitForSelector('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')
    await page.click('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')

    const REDUCE_DURATION_BUTTON_SELECTOR = '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)';

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(REDUCE_DURATION_BUTTON_SELECTOR)
    await page.click(REDUCE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn')
    await page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn');

    await page.waitForSelector('#dt_purchase_call_price')
});
test('[mobile] trader/buy-rise-contract-max-duration', async () => {
    await page.waitForSelector('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')
    await page.click('.mobile-wrapper > .dc-collapsible > .dc-collapsible__content > .mobile-widget__wrapper > .mobile-widget')

    const INCREASE_DURATION_BUTTON_SELECTOR = '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)';

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector(INCREASE_DURATION_BUTTON_SELECTOR)
    await page.click(INCREASE_DURATION_BUTTON_SELECTOR)

    await page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn')
    await page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn');

    await page.waitForSelector('#dt_purchase_call_price')
});

async function preBuy() {
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    await loadOrLogin(page, process.env.VALID_USER, process.env.VALID_PASSWORD);
    await waitForChart(page);
    await page.click('.acc-info__wrapper .acc-info');
    await page.click('.dc-tabs__item:nth-child(2)');
    await page.click(".acc-switcher__accounts >> text=Demo");
    await page.click('.top-widgets-portal .cq-menu-btn');
    await page.click(".data-hj-whitelist");
    await page.fill(".data-hj-whitelist", "Volatility");
    await page.click('text="Volatility 10 (1s) Index"');
    await page.click(".contract-type-widget__display");
    await waitForChart(page);
    await page.click("#dt_contract_rise_fall_item");
    await waitForChart(page);
    await waitForPurchaseBtnEnabled(page);
}

