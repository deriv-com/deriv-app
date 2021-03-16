const assert = require('assert').strict;
const qawolf = require('qawolf');
const logger = require('@root/_utils/logger');
const { replaceWebsocket } = require('@root/_utils/websocket'); // TODO: Fix the path
const { setUp, tearDown, mobile_viewport, desktop_viewport } = require('@root/bootstrap'); // TODO: Fix the path
const Common = require('@root/objects/common'); // TODO: Fix the path
let browser, context, page;

describe('Time to interactive in desktop', () => {
    beforeEach(async () => {
        const out = await setUp(desktop_viewport);
        browser = out.browser;
        context = out.context;
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await tearDown(browser);
    });

    test("[performance]-time-to-interactive", async () => {
        await page.navigate()
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'TTI for desktop:', {
            'connection start:': performance_timing.timing.connectStart,
            'purchase button time:': button_enabled_time,
            'nTTI:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`
        })
    });
})

describe('Time to interactive in mobile', () => {
    beforeEach(async () => {
        const out = await setUp(mobile_viewport);
        browser = out.browser;
        context = out.context;
        await context.addInitScript(replaceWebsocket);
        page = new Common(await context.newPage());
    });

    afterEach(async () => {
        await tearDown(browser);
    });

    test("[performance]-time-to-interactive", async () => {
        await page.navigate()
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')
        const button_enabled_time = Date.now()
        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))

        logger.save(expect.getState().testPath, 'TTI for mobile:', {
            'connection start:': performance_timing.timing.connectStart,
            'purchase button time:': button_enabled_time,
            'nTTI:': `${button_enabled_time - performance_timing.timing.connectStart} (ms)`
        })
    });
})
