const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const default_context_config = require('@root/_config/context');
const { mobile_viewport } = require('@root/bootstrap');

let p;

describe('Time to chart ready in desktop', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        p = new Trader(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await p.navigate()
        await p.waitForChart();
        const chart_ready_time = Date.now()
        const performanceTiming = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'Chart ready for desktop:', {
            'connection start:': performanceTiming.timing.connectStart,
            'chart ready time:': chart_ready_time,
            'TTCR:': `${chart_ready_time - performanceTiming.timing.connectStart} (ms)`,
        })
    });
})

describe('Time to chart ready in mobile', () => {
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

    test("[performance]-time-to-chart-ready", async () => {
        await p.navigate()
        await p.waitForChart();
        const chart_ready_time = Date.now()
        const performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'Chart ready for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'chart ready time:': chart_ready_time,
            'TTCR:': `${chart_ready_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})
