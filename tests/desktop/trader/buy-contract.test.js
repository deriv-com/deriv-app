const {
  chooseUnderlying,
  buyRiseContract,
  openRecentPositionsDrawer,
} = require("../../_common/contract_tasks");
const Trader = require('../../objects/trader');
const {setUp, tearDown, desktop_viewport} = require('../../bootstrap');

let browser, context, page;

beforeAll(async () => {
    const out = await setUp(desktop_viewport);

    browser = out.browser;
    context = out.context;
    const p = await context.newPage();
    page = new Trader(p);
});

afterAll(async () => {
    await tearDown(browser);
});

test("[desktop] trader/buy-contract", async () => {
    await page.navigate();
    await page.waitForChart();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await chooseUnderlying(page);
    await openRecentPositionsDrawer(page);
    await buyRiseContract(page, 'Ups & Downs', "rise_fall", "Ticks", 5);
});
