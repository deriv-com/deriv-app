const browsers = require('playwright');
const default_options = require('@root/_config/context');

let browser;
let browser_requests = 0;

async function setUp(options = {}) {
    const browserType = browsers[options.browser || 'chromium'];
    const getBrowserInstance = () => {
        browser_requests += 1;
        if (!browser) {
            browser = browserType.launch({
                ...default_options,
                ...options,
            });
        }

        return browser;
    }

    return {
        getBrowserInstance,
    };
}

async function tearDown(browser) {
    browser_requests -= 1;
    if (browser_requests) {
        try {
            await browser.close();
        } catch (e) {
            console.log(e);
        }
    }

}

function getContext() {
    return context;
}

function getStorageState(which) {
    const storage_string = process.env[which];
    if (storage_string) {
        return JSON.parse(storage_string);
    }
    return {};
}

// This is empty for now, since QAWolf will default to desktop
const desktop_viewport = {};

// Used for setting the viewport to mobile
const mobile_viewport = {
    userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    viewport: {
        width: 375,
        height: 667,
    },
    deviceScaleFactor: 2,
    hasTouch: true,
    defaultBrowserType: 'webkit',
};

module.exports = {
    setUp,
    tearDown,
    desktop_viewport,
    mobile_viewport,
    getContext,
    getStorageState,
};
