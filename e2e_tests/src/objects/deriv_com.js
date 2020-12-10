const assert = require('assert').strict;
const Common = require('./common');

class DerivCom extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    // eslint-disable-next-line class-methods-use-this
    async generateString() {
        return ((Math.random()) * 1000000).toString(36).substring(0).replace('.', '');
    }

    async navigate() {
        await this.page.goto(process.env.DERIV_COM_URL);
    }

    async fakeEmail(prefix = 'qawolf', suffix = 'cr') {
        const salt = await this.generateString();

        return `${prefix}+${suffix}${salt}@deriv.com`;
    }

    async signup(email) {
        await this.page.click('text=Start trading');
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('#signup_agree_tnc');
        await this.page.click('#signup_agree_tnc');
        await this.page.waitForSelector('#email');
        await this.page.fill('#email', email);
        await this.page.waitForSelector('#gtm-signup-email');
        await this.page.click('#gtm-signup-email');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('text=Check your email');
    }



    async connectToQALocalStorage() {
        const server = process.env.QABOX_SERVER;
        const app_id = process.env.QABOX_APP_ID;
        const SET_SCRIPT = `
            localStorage.setItem('config.server_url', "${server}");
            localStorage.setItem('config.app_id', "${app_id}");
        `;
        await this.page.evaluate(SET_SCRIPT);
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
        const server_url = await this.page.evaluate(() => {
            const result = localStorage.getItem('config.server_url');
            return Promise.resolve(result);
        });
        assert.equal(server_url, process.env.QABOX_SERVER);
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
    }
}

module.exports = DerivCom;
