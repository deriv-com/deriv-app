const path = require('path');
const fs = require('fs');
const qawolf = require('qawolf');
const {waitForChart} = require('../_common/contract_tasks');

const LOGIN_STATE_PATH = '../tests/states/login.json';
/**
 *
 * @param page
 * @returns {Promise<void>}
 */
async function acceptCookies(page) {
    await page.waitForSelector(".cookie-banner__btn-accept");
    await page.click(".cookie-banner__btn-accept");
}

/**
 * Login into the page using credentials
 * @param page
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
async function login(page, email, password) {
    await page.click("#dt_login_button");
    await page.click('[name="email"]');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', password);
    await page.click(".button");
    await waitForChart(page);
    await qawolf.saveState(page, LOGIN_STATE_PATH);
}

async function loadOrLogin(page, email, password) {
    const is_login_done = await checkIfStateExists();
    if (!is_login_done) {
        await login(page, email, password);
    } else {
        await qawolf.setState(page, LOGIN_STATE_PATH);
        await page.reload();
    }
}

async function checkIfStateExists() {
    try {
        return fs.existsSync(path.resolve(LOGIN_STATE_PATH));
    } catch (e) {
        return false;
    }

}

/**
 * Set the Endpoint
 * @param page
 * @returns {Promise<void>}
 */
async function setEndpoint(page, url, endpoint_server, app_id) {
    await page.goto(`${url}endpoint`);
    await page.fill('[name="server"]', endpoint_server);
    await page.fill('[name="app_id"]', app_id);
    await page.click("text=Submit");
    await page.waitForLoadState('domcontentloaded');
    await qawolf.saveState(page, './.qawolf/state/admin.json');
}

/**
 *
 * @type {{acceptCookies: (function(*): Promise<void>)}}
 */
module.exports = {
    setEndpoint,
    acceptCookies,
    login,
    loadOrLogin,
};
