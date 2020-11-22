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


test('[mobile] trader/buy-fall-contract-default-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 5, 'put', false);
    await page.assertPurchase(5, 10, 'PUT');
});

test('[mobile] trader/buy-fall-contract-min-duration', async () =>  {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 1, 'put', false);
    await page.assertPurchase(1, 10, 'PUT');
});

test('[mobile] trader/buy-fall-contract-max-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 10, 'put', false);
    await page.assertPurchase(10, 10, 'PUT');
});

test('[mobile] trader/buy-rise-equal-contract-min-duration', async () =>  {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 1, 'put', true);
    await page.assertPurchase(1, 10, 'PUTE');
});

test('[mobile] trader/buy-rise-equal-contract-max-duration', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'rise_fall', 'Ticks', 10, 'put', true);
    await page.assertPurchase(10, 10, 'PUTE');
});
