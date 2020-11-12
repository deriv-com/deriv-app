const assert = require('assert').strict;
const {replaceWebsocket, waitForWSSubset} = require('../../_utils/websocket');
const {setUp, tearDown} = require('../../bootstrap');
const Trader = require('../../objects/trader');

let browser, context, page;

beforeEach(async () => {
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
    await context.addInitScript(replaceWebsocket);
    page = new Trader(await context.newPage());
    await preBuy();
});

afterEach(async () => {
    await tearDown(browser);
});

test('[mobile] trader/buy-fall-contract-default-duration', async () => {
    await page.waitForSelector('#dt_purchase_put_price');
    await page.assertPurchase(5, 10, 'PUT');
});

test('[mobile] trader/buy-fall-contract-min-duration', async () =>  {
    await page.changeDuration(1);
    await page.assertPurchase(1, 10, 'PUT');
});

test('[mobile] trader/buy-fall-contract-max-duration', async () => {
    await page.changeDuration(10);
    await page.assertPurchase(10, 10, 'PUT');
});

async function preBuy() {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD)
    await page.waitForChart();
    await page.click('.acc-info__wrapper .acc-info');
    await page.click('.dc-tabs__item:nth-child(2)');
    await page.click(".acc-switcher__accounts >> text=Demo");
    await page.click('.top-widgets-portal .cq-menu-btn');
    await page.click(".data-hj-whitelist");
    await page.fill(".data-hj-whitelist", "Volatility");
    await page.click('text="Volatility 10 (1s) Index"');
    await page.click(".contract-type-widget__display");
    await page.waitForChart();
    await page.click("#dt_contract_rise_fall_item");
    await page.waitForChart();
    await page.waitForPurchaseBtnEnabled();
}

