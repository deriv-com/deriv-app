const assert = require('assert').strict;
const Trader = require('../../objects/trader');
const {waitForWSSubset} = require("../../_utils/websocket");
const {replaceWebsocket} = require("../../_utils/websocket");
const {setUp, tearDown, desktop_viewport} = require('../../bootstrap');

let browser, context, page;

beforeEach(async () => {
    const out = await setUp(desktop_viewport);

    browser = out.browser;
    context = out.context;
    await context.addInitScript(replaceWebsocket);
    const p = await context.newPage();
    page = new Trader(p);
});

afterEach(async () => {
    await tearDown(browser);
});

async function preBuy() {
    await page.navigate();
    await page.waitForChart();
    await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
    await page.switchVirtualAccount();
    await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
    await page.openRecentPositionsDrawer();
}

test('[desktop] trader/buy-contract rise', async () => {
    await preBuy();
    await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5);
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 5,
            duration_unit: 't',
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(
        message.echo_req.duration === 5,
        `Duration was not set properly, expected 5, received: ${message.echo_req.duration}`
    );
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: '10.00',
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
    await page.assertContractDetails();
});
test("[desktop] trader/buy-contract fall", async () => {
    await preBuy();
    await page.buyContract('Ups & Downs', "rise_fall", "Ticks", 5, 'put');
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "PUT",
            currency: "USD",
            duration: 5,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 5, `Duration was not set properly, expected 5, received: ${message.echo_req.duration}`);
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
    await page.assertContractDetails();
});
test("[desktop] trader/buy-contract rise equal", async () => {
    await preBuy();
    await page.buyContract('Ups & Downs', "rise_fall", "Ticks", 5, 'call', true);
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "CALLE",
            currency: "USD",
            duration: 5,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 5, `Duration was not set properly, expected 5, received: ${message.echo_req.duration}`);
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
    await page.assertContractDetails();
});
test("[desktop] trader/buy-contract fall equal", async () => {
    await preBuy();
    await page.buyContract('Ups & Downs', "rise_fall", "Ticks", 5, 'put', true);
    const message = await waitForWSSubset(page, {
        echo_req: {
            amount: 10,
            basis: "stake",
            contract_type: "PUTE",
            currency: "USD",
            duration: 5,
            duration_unit: "t",
            proposal: 1,
        },
    });
    assert.ok(message, 'No proper proposal was found');
    assert.ok(message.echo_req.duration === 5, `Duration was not set properly, expected 5, received: ${message.echo_req.duration}`);
    const buy_response = await waitForWSSubset(page, {
        echo_req: {
            price: "10.00",
        },
    });
    assert.equal(buy_response.buy.buy_price, 10, 'Buy price does not match proposal.');
    await page.assertContractDetails();
});
