const {setUp, tearDown, mobile_viewport} = require('@root/bootstrap');
const Trader = require('@root/objects/trader');
const {replaceWebsocket} = require("@root/_utils/websocket");

let browser, context, page;

beforeEach(async () => {
    const out = await setUp(mobile_viewport);
    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    page = new Trader(await context.newPage());
});

afterEach(async () => {
    await tearDown(browser);
});


test('[mobile] trader/buy-rise-contract-default-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 5, 'call', false);
    await page.assertPurchase(5, 10, 'CALL');
});

test('[mobile] trader/buy-rise-contract-min-duration', async () =>  {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 1, 'call', false);
    await page.assertPurchase(1, 10, 'CALL');
});

test('[mobile] trader/buy-rise-contract-max-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 10, 'call', false);
    await page.assertPurchase(10, 10, 'CALL');
});

test('[mobile] trader/buy-rise-equal-contract-min-duration', async () =>  {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 1, 'call', true);
    await page.assertPurchase(1, 10, 'CALLE');
});

test('[mobile] trader/buy-rise-equal-contract-max-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 10, 'call', true);
    await page.assertPurchase(10, 10, 'CALLE');
});
