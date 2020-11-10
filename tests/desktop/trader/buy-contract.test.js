const assert = require('assert').strict;
const Trader = require('../../objects/trader');
const {waitForWSSubset} = require("../../_utils/websocket");
const {replaceWebsocket} = require("../../_utils/websocket");
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

test("[desktop] trader/buy-contract rise", async () => {
    await context.addInitScript(replaceWebsocket);
    await page.navigate();
    await page.waitForChart();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "CALL",
            currency: "USD",
            duration: 5,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 5, `Duration was not set properly, expected 5, received: ${  message.echo_req.duration}`);
    await page.openRecentPositionsDrawer();
    await page.buyRiseContract('Ups & Downs', "rise_fall", "Ticks", 5);
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });

    assert.equal(message.proposal.id, buy_response.echo_req.buy, 'Buy does not match Proposal');
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
});
