const assert = require('assert').strict;
const qawolf = require('qawolf');
const logger = require('@root/_utils/logger');
const { replaceWebsocket } = require('@root/_utils/websocket'); // TODO: Fix the path
const { setUp, tearDown, mobile_viewport, desktop_viewport } = require('@root/bootstrap'); // TODO: Fix the path
const Common = require('@root/objects/common'); // TODO: Fix the path
let browser, context, page;

describe('Resource list in desktop', () => {
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

    test("[performance]-resources-desktop", async () => {
        await page.navigate()
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')

        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))
        const resource_list = JSON.parse(await page.evaluate(() => JSON.stringify(performance.getEntriesByType("resource"))))

        let data = []
        for (let i = 0; i < resource_list.length; i++) {
            const name = resource_list[i].name.split('/').pop().split('?')[0].split('#')[0]
            const type = name.split('.').pop()
            data.push({
                name: name,
                size: resource_list[i].transferSize,
                type: type,
            })
        }
        // remove duplicates
        data = data.filter((value, index, array) => array.findIndex(item => (item.name === value.name)) === index)
        const total_bytes = data.reduce((a, b) => { return { size: Number(a.size) + Number(b.size) } }, { size: 0 })
        logger.save(expect.getState().testPath, 'Resource list in desktop:', {
            'Number of requests:': data.length,
            'Total transfered data:': `${total_bytes.size} (${total_bytes.size / 1000000} MB)`,
            'Performance timing:': performance_timing.timing,
            'Request list:': data
        })

    });
})

describe('Resource list in mobile', () => {
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

    test("[performance]-resources-mobile", async () => {
        await page.navigate()
        await page.waitForSelector('.btn-purchase:not(.btn-purchase--disabled)')

        const performance_timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())))
        const resource_list = JSON.parse(await page.evaluate(() => JSON.stringify(performance.getEntriesByType("resource"))))

        let data = []
        for (let i = 0; i < resource_list.length; i++) {
            const name = resource_list[i].name.split('/').pop().split('?')[0].split('#')[0]
            const type = name.split('.').pop()
            data.push({
                name: name,
                size: resource_list[i].transferSize,
                type: type,
            })
        }
        // remove duplicates
        data = data.filter((value, index, array) => array.findIndex(item => (item.name === value.name)) === index)
        const total_bytes = data.reduce((a, b) => { return { size: Number(a.size) + Number(b.size) } }, { size: 0 })
        logger.save(expect.getState().testPath, 'Resource list in mobile:', {
            'Number of requests:': data.length,
            'Total transfered data:': `${total_bytes.size} (${total_bytes.size / 1000000} MB)`,
            'Performance timing:': performance_timing.timing,
            'Request list:': data
        })
    });
})