const { setUp, tearDown, mobile_viewport, desktop_viewport, getStorageState } = require('@root/bootstrap');
const Trader = require('@root/objects/trader');
const { replaceWebsocket } = require('@root/_utils/websocket');
const path = require('path');

let browser, context, page;
jest.setTimeout(70000);
describe('Contract test', () => {
    async function setUpTest() {
        await context.addInitScript(replaceWebsocket);
        page = new Trader(await context.newPage());
        await page.navigate();
        if (!process.env.LOGIN) {
            await page.login(process.env.VALID_USER, process.env.VALID_PASSWORD);
        }
        await page.waitForChart();
        await page.switchVirtualAccount();
        await page.waitForAccountInfoDropdown();
    }

    beforeAll(async () => {
        const out = await setUp({});
        browser = out.browser;
    });

    afterEach(async () => {
        await page.clearTradeUIArtifacts();
        await page.saveState('LOGIN', context);
        await page.close();
        await context.close();
    });

    afterAll(async () => {
        await tearDown(browser);
    });

    describe('Desktop', () => {
        beforeEach(async () => {
            context = await browser.newContext({
                recordVideo: { dir: path.resolve(process.env.E2E_ARTIFACT_PATH, 'contract_purchase.test.js') },
                ignoreHTTPSErrors: true,
                storageState: getStorageState('LOGIN'),
                ...desktop_viewport,
            });
            await setUpTest();
        });
        test('trader/buy-contract rise', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', false);
            await page.assertPurchase(5, 10, 'CALL');
        });

        test('trader/buy-contract fall', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', false);
            await page.assertPurchase(5, 10, 'PUT');
        });

        test('trader/buy-contract rise equal', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', true);
            await page.assertPurchase(5, 10, 'CALLE');
        });

        test('trader/buy-contract fall equal', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', true);
            await page.assertPurchase(5, 10, 'PUTE');
        });
    });
    describe('Mobile', () => {
        beforeEach(async () => {
            context = await browser.newContext({
                ignoreHTTPSErrors: true,
                storageState: getStorageState('LOGIN'),
                ...mobile_viewport,
            });
            await setUpTest();
        });

        test('trader/buy-fall-contract-default-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', false);
            await page.assertPurchase(5, 10, 'PUT');
        });

        test('trader/buy-fall-contract-min-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'put', false);
            await page.assertPurchase(1, 10, 'PUT');
        });

        test('trader/buy-fall-contract-max-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'put', false);
            await page.assertPurchase(10, 10, 'PUT');
        });

        test('trader/buy-fall-equal-contract-min-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'put', true);
            await page.assertPurchase(1, 10, 'PUTE');
        });

        test('trader/buy-fall-equal-contract-max-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'put', true);
            await page.assertPurchase(10, 10, 'PUTE');
        });

        test('trader/buy-rise-contract-default-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', false);
            await page.assertPurchase(5, 10, 'CALL');
        });

        test('trader/buy-rise-contract-min-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'call', false);
            await page.assertPurchase(1, 10, 'CALL');
        });

        test('trader/buy-rise-contract-max-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'call', false);
            await page.assertPurchase(10, 10, 'CALL');
        });

        test('trader/buy-rise-equal-contract-min-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'call', true);
            await page.assertPurchase(1, 10, 'CALLE');
        });

        test('trader/buy-rise-equal-contract-max-duration', async () => {
            await page.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'call', true);
            await page.assertPurchase(10, 10, 'CALLE');
        });

        test('trader/over-under', async () => {
            await page.buyContract('Digits', 'over_under', 'Ticks', 5, 'digitover', false);
            await page.assertPurchase(5, 10, 'DIGITOVER');
        });

        test('trader/no-touch', async () => {
            await page.buyContract('Highs & Lows', 'touch', 'Ticks', 5, 'notouch', false);
            await page.assertPurchase(5, 10, 'NOTOUCH');
        });

        test('trader/touch', async () => {
            await page.buyContract('Highs & Lows', 'touch', 'Ticks', 5, 'onetouch', false);
            await page.assertPurchase(5, 10, 'ONETOUCH');
        });

        test('trader/even', async () => {
            await page.buyContract('Digits', 'even_odd', 'Ticks', 5, 'digiteven', false);
            await page.assertPurchase(5, 10, 'digiteven');
        });

        test('trader/odd', async () => {
            await page.buyContract('Digits', 'even_odd', 'Ticks', 5, 'digitodd', false);
            await page.assertPurchase(5, 10, 'DIGITODD');
        });

        test('trader/match', async () => {
            await page.buyContract('Digits', 'match_diff', 'Ticks', 5, 'digitmatch', false);
            await page.assertPurchase(5, 10, 'digitmatch');
        });

        test('trader/diff', async () => {
            await page.buyContract('Digits', 'match_diff', 'Ticks', 5, 'digitdiff', false);
            await page.assertPurchase(5, 10, 'digitdiff');
        });
    });
});
