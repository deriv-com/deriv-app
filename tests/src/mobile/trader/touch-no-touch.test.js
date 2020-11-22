const { replaceWebsocket } = require('@root/_utils/websocket'); // TODO: Fix the path
const { setUp, tearDown, mobile_viewport } = require('@root/bootstrap'); // TODO: Fix the path
const Trader = require('@root/objects/trader'); // TODO: Fix the path

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

test('[mobile]-trader/no-touch', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Highs & Lows', "touch", "Ticks", 5, 'notouch');
    await page.assertPurchase(5, 10, 'NOTOUCH');
});

test('[mobile]-trader/touch', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Highs & Lows', "touch", "Ticks", 5, 'onetouch');
    await page.assertPurchase(5, 10, 'ONETOUCH');
});
