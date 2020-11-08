const {
  chooseUnderlying,
  buyRiseContract,
  waitForChart,
  openRecentPositionsDrawer,
} = require("../../_common/contract_tasks");
const {switchVirtualAccount} = require('../../_common/common_tasks');
const {loadOrLogin} = require("../../_utils/page");
const {setUp, tearDown, desktop_viewport} = require('../../bootstrap');

let browser, context

beforeAll(async () => {
    const out = await setUp(desktop_viewport);

    browser = out.browser;
    context = out.context;
});

afterAll(async () => {
    await tearDown(browser);
});

test("[desktop] trader/buy-contract", async () => {
    const page = await context.newPage();
    await page.goto(process.env.HOME_URL, {waitUntil: "domcontentloaded"});
    await waitForChart(page);
    await loadOrLogin(page, process.env.VALID_USER, process.env.VALID_PASSWORD);
    await switchVirtualAccount(page);
    await chooseUnderlying(page);
    await openRecentPositionsDrawer(page);
    await buyRiseContract(page, 'Ups & Downs', "rise_fall", "Ticks", 5);
});
