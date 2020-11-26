const assert = require('assert').strict;
const {setUp, tearDown, mobile_viewport, desktop_viewport} = require('@root/bootstrap');
const Trader = require('@root/objects/trader');
const {replaceWebsocket} = require("@root/_utils/websocket");

let browser, context, page;

describe('Contract purchases in desktop', () => {
    beforeEach(async () => {
        const out = await setUp(desktop_viewport);
        browser = out.browser;
        context = out.context;
        await context.addInitScript(replaceWebsocket);
        page = new Trader(await context.newPage());
    });

    afterEach(async () => {
        await tearDown(browser);
    });

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

})

describe('Contract purchases in mobile', () => {
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

    test('[mobile]-trader/over-under', async () => {
        await page.navigate();
        await page.loadOrLogin(process.env.VALID_USER, process.env.VALID_PASSWORD);
        await page.switchVirtualAccount();
        await page.chooseUnderlying('1HZ10V', 'Volatility 10 (1s) Index');
        await page.buyContract('Digits', 'over_under', 'Ticks', 5, 'digitover');
        await page.assertPurchase(5, 10, 'DIGITOVER');
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
})
