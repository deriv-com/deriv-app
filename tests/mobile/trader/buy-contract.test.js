const qawolf = require('qawolf');
const {waitForPurchaseBtnEnabled} = require("../../_common/contract_tasks");
const {
    waitForChart,
} = require("../../_common/contract_tasks");

const {login} = require("../../_utils/page");
const {setUp, tearDown} = require('../../bootstrap');

let browser, context

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

test("[mobile] trader/buy-contract", async () => {
    const page = await context.newPage();
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    await waitForChart(page);
    await login(page, process.env.VALID_USER, process.env.VALID_PASSWORD);
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
    await page.waitForTimeout(5000);
    await page.click("#dt_purchase_call_price");
    await page.waitForTimeout(5000);
});
