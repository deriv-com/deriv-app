const { mobile_viewport, getStorageState } = require('@root/bootstrap');
const Trader = require('@root/objects/trader');
const { replaceWebsocket } = require('@root/_utils/websocket');

let p;
jest.setTimeout(120000);
describe('Contract test', () => {
    async function setUpTest() {
        await context.addInitScript(replaceWebsocket);
        await jestPlaywright.resetPage();
        p = new Trader(page);
        await p.navigate();
        if (!process.env.LOGIN) {
            await p.login(process.env.VALID_USER, process.env.VALID_PASSWORD);
        }
        await p.waitForChart();
        await p.switchVirtualAccount();
        await p.waitForAccountInfoDropdown();
    }

    afterEach(async () => {
        await p.clearTradeUIArtifacts();
        await p.saveState('LOGIN', context);
        await p.close();
    });

    describe('Desktop', () => {
        beforeEach(async () => {
            await setUpTest();
        });
        test('trader/buy-contract rise', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', false);
            await p.assertPurchase(5, 10, 'CALL');
        });

        test('trader/buy-contract fall', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', false);
            await p.assertPurchase(5, 10, 'PUT');
        });

        test('trader/buy-contract rise equal', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', true);
            await p.assertPurchase(5, 10, 'CALLE');
        });

        test('trader/buy-contract fall equal', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', true);
            await p.assertPurchase(5, 10, 'PUTE');
        });
    });
    describe('Mobile', () => {
        beforeAll(async () => {
            await jestPlaywright.resetContext({
                ignoreHTTPSErrors: true,
                storageState: getStorageState('LOGIN'),
                ...mobile_viewport,
            });
        });

        beforeEach(async () => {
            await setUpTest();
        });

        test('trader/buy-fall-contract-default-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'put', false);
            await p.assertPurchase(5, 10, 'PUT');
        });

        test('trader/buy-fall-contract-min-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'put', false);
            await p.assertPurchase(1, 10, 'PUT');
        });

        test('trader/buy-fall-contract-max-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'put', false);
            await p.assertPurchase(10, 10, 'PUT');
        });

        test('trader/buy-fall-equal-contract-min-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'put', true);
            await p.assertPurchase(1, 10, 'PUTE');
        });

        test('trader/buy-fall-equal-contract-max-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'put', true);
            await p.assertPurchase(10, 10, 'PUTE');
        });

        test('trader/buy-rise-contract-default-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 5, 'call', false);
            await p.assertPurchase(5, 10, 'CALL');
        });

        test('trader/buy-rise-contract-min-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'call', false);
            await p.assertPurchase(1, 10, 'CALL');
        });

        test('trader/buy-rise-contract-max-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'call', false);
            await p.assertPurchase(10, 10, 'CALL');
        });

        test('trader/buy-rise-equal-contract-min-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 1, 'call', true);
            await p.assertPurchase(1, 10, 'CALLE');
        });

        test('trader/buy-rise-equal-contract-max-duration', async () => {
            await p.buyContract('Ups & Downs', 'rise_fall', 'Ticks', 10, 'call', true);
            await p.assertPurchase(10, 10, 'CALLE');
        });

        test('trader/over-under', async () => {
            await p.buyContract('Digits', 'over_under', 'Ticks', 5, 'digitover', false);
            await p.assertPurchase(5, 10, 'DIGITOVER');
        });

        test('trader/no-touch', async () => {
            await p.buyContract('Highs & Lows', 'touch', 'Ticks', 5, 'notouch', false);
            await p.assertPurchase(5, 10, 'NOTOUCH');
        });

        test('trader/touch', async () => {
            await p.buyContract('Highs & Lows', 'touch', 'Ticks', 5, 'onetouch', false);
            await p.assertPurchase(5, 10, 'ONETOUCH');
        });

        test('trader/even', async () => {
            await p.buyContract('Digits', 'even_odd', 'Ticks', 5, 'digiteven', false);
            await p.assertPurchase(5, 10, 'digiteven');
        });

        test('trader/odd', async () => {
            await p.buyContract('Digits', 'even_odd', 'Ticks', 5, 'digitodd', false);
            await p.assertPurchase(5, 10, 'DIGITODD');
        });

        test('trader/match', async () => {
            await p.buyContract('Digits', 'match_diff', 'Ticks', 5, 'digitmatch', false);
            await p.assertPurchase(5, 10, 'digitmatch');
        });

        test('trader/diff', async () => {
            await p.buyContract('Digits', 'match_diff', 'Ticks', 5, 'digitdiff', false);
            await p.assertPurchase(5, 10, 'digitdiff');
        });
    });
});
