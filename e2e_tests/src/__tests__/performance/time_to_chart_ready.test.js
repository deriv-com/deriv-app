const logger = require('@root/_utils/logger');
const { replaceWebsocket } = require('@root/_utils/websocket'); // TODO: Fix the path
const Common = require('@root/objects/common');

let page;

describe('Time to chart ready in desktop', () => {
    beforeEach(async () => {
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await page.navigate()
        await page.waitForSelector('.smartcharts')
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
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await page.close();
    });

    test("[performance]-time-to-chart-ready", async () => {
        await page.navigate()
        await page.waitForSelector('.smartcharts')
        const chart_ready_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'Chart ready for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'chart ready time:': chart_ready_time,
            'TTCR:': `${chart_ready_time - performance_timing.timing.connectStart} (ms)`,
        })
    });
})
