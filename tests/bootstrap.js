const qawolf = require('qawolf');
const default_options = require('./_config/context');

async function setUp(options) {
    const browser = await qawolf.launch();
    const context = await browser.newContext({
        ...default_options,
        ...options,
    });
    await qawolf.register(context);

    return {
        browser,
        context,
    };
}

async function tearDown(browser) {
    await qawolf.stopVideos();
    try {
        await browser.close();
    } catch (e) {
        console.log(e);
    }

}

function getContext() {
    return context;
}

// This is empty for now, since QAWolf will default to desktop
const desktop_viewport = {};

module.exports = {
    setUp,
    tearDown,
    desktop_viewport,
    getContext,
}
