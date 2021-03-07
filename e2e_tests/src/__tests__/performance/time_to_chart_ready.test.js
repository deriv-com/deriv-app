const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const default_context_config = require('@root/_config/context');
const { mobile_viewport } = require('@root/bootstrap');

let page;

describe('Time to chart ready in desktop', () => {
    beforeEach(async () => {
        page = new Trader(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await page.navigate()
        await page.waitForChart();
        const chart_ready_time = Date.now()
        const performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

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
        page = new Trader(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await page.navigate()
        await page.waitForChart();
        const chart_ready_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'Chart ready for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'chart ready time:': chart_ready_time,
            'TTCR:': `${chart_ready_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})
