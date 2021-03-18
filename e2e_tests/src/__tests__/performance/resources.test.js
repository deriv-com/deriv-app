const logger = require('@root/_utils/logger');
const Trader = require('@root/objects/trader');
const default_context_config  = require('@root/_config/context')
const { mobile_viewport } = require('@root/bootstrap');

let p;
jest.setTimeout(200000);

async function fetchPerformanceResults() {
    await p.navigate();
    await p.waitForChart();

    const performance_timing = JSON.parse(await p.evaluate(() => JSON.stringify(window.performance.toJSON())));
    const resource_list = JSON.parse(await p.evaluate(() => JSON.stringify(performance.getEntriesByType('resource'))));

    let data = [];
    for (let i = 0; i < resource_list.length; i++) {
        const name = resource_list[i].name.split('/').pop().split('?')[0].split('#')[0];
        const type = name.split('.').pop();
        data.push({
            name,
            size: resource_list[i].transferSize,
            type,
        });
    }
    // remove duplicates
    data = data.filter((value, index, array) => array.findIndex(item => (item.name === value.name)) === index);
    const total_bytes = data.reduce((a, b) => {
        return { size: Number(a.size) + Number(b.size) };
    }, { size: 0 });
    return { performance_timing, data, total_bytes };
}

describe('Resource list in desktop', () => {
    beforeEach(async () => {
        await jestPlaywright.resetContext({
            ...default_context_config,
        });
        p = new Trader(page);
    });

    afterEach(async () => {
        await p.close();
    });

    test("[performance]-resources-desktop", async () => {
        const { performance_timing, data, total_bytes } = await fetchPerformanceResults();
        logger.save(expect.getState().testPath, 'Resource list in desktop:', {
            'Number of requests:': data.length,
            'Total transferred data:': `${total_bytes.size} (${total_bytes.size / 1000000} MB)`,
            'Performance timing:': performance_timing.timing,
            'Request list:': data,
        })
    });
})

describe('Resource list in mobile', () => {
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

    test("[performance]-resources-mobile", async () => {
        const { performance_timing, data, total_bytes } = await fetchPerformanceResults();
        logger.save(expect.getState().testPath, 'Resource list in mobile:', {
            'Number of requests:': data.length,
            'Total transferred data:': `${total_bytes.size} (${total_bytes.size / 1000000} MB)`,
            'Performance timing:': performance_timing.timing,
            'Request list:': data,
        })
    });
})
