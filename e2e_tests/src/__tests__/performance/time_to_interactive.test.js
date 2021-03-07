const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const { mobile_viewport } = require('@root/bootstrap');
const default_context_config = require('@root/_config/context');

let  p;

describe('Time to interactive in desktop', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        p = new Trader(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test("[performance]-time-to-interactive", async () => {
        await p.navigate()
        await p.chooseUnderlying('Synthetic Indices', 'Volatility 100 (1s) Index');
        await p.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())))

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
        p = new Trader(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test("[performance]-time-to-interactive", async () => {
        await p.navigate()
        await p.chooseUnderlying('Synthetic Indices', 'Volatility 100 (1s) Index');
        await p.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'TTI for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'purchase button enable time:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
            'nTTI:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})
