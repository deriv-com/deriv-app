const {setUp, tearDown, mobile_viewport} = require('../../bootstrap');
const Trader = require('../../objects/trader');
const {replaceWebsocket} = require("../../_utils/websocket");

let browser, context, page;

beforeEach(async () => {
    const out = await setUp(mobile_viewport);
    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    page = new Trader(await context.newPage());
    await preBuy();
});

afterEach(async () => {
    await tearDown(browser);
});

test('[mobile] trader/buy-rise-contract-default-duration', async () => {
    await page.waitForSelector('#dt_purchase_call_price');
    await page.assertPurchase(5, 10, 'CALL');
    await page.assertContractDetails();
});

test('[mobile] trader/buy-rise-contract-min-duration', async () =>  {
    await page.changeDuration(1);
    await page.assertPurchase(1, 10, 'CALL');
    await page.assertContractDetails();
});

test('[mobile] trader/buy-rise-contract-max-duration', async () => {
    await page.changeDuration(10);
    await page.assertPurchase(10, 10, 'CALL');
    await page.assertContractDetails();
});

test('[mobile] trader/buy-rise-equal-contract-min-duration', async () =>  {
    await page.changeDuration(1);
    await page.assertPurchase(1, 10, 'CALLE');
    await page.assertContractDetails();
});

test('[mobile] trader/buy-rise-equal-contract-max-duration', async () => {
    await page.changeDuration(10);
    await page.assertPurchase(10, 10, 'CALLE');
    await page.assertContractDetails();
});


async function preBuy() {
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
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

