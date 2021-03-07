const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const { mobile_viewport } = require('@root/bootstrap');
const default_context_config = require('@root/_config/context');

let  page;

describe('Time to interactive in desktop', () => {
    beforeEach(async () => {
        page = new Trader(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-interactive", async () => {
        await page.navigate()
        await page.chooseUnderlying('Synthetic Indices', 'Volatility 100 (1s) Index');
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'TTI for desktop:', {
            'connection start:': performance_timing.timing.connectStart,
            'purchase button enable time:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
            'nTTI:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})

describe('Time to interactive in mobile', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
            ...mobile_viewport,
        });
        page = new Trader(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-interactive", async () => {
        await page.navigate()
        await page.chooseUnderlying('Synthetic Indices', 'Volatility 100 (1s) Index');
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'TTI for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'purchase button enable time:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
            'nTTI:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})
