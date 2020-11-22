const { replaceWebsocket } = require('@root/_utils/websocket');
const { setUp, tearDown, mobile_viewport } = require('@root/bootstrap');
const Trader = require('@root/objects/trader');

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

test('[mobile]-trader/over-under', async () => {
    await page.navigate();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.buyContract('Digits', 'over_under', 'Ticks', 5, 'digitover');
    await page.assertPurchase(5, 10, 'DIGITOVER');
});
