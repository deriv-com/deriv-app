const qawolf = require('qawolf');
const path = require('path');
const fs = require('fs');

const LOGIN_STATE_PATH = './tests/states/login.json';

class Common {
    constructor(page) {
        this.page = page;

        // Call Page methods whenever it is not existed in the Common class
        return new Proxy(this, {
            get(target, field) {
                if (field in target) return target[field];
                if (field in page) return page[field];
                return undefined;
            },
            apply(target, field, argumentList) {
                if (target[field]) return target[field](...argumentList);
                if (page[field]) return page[field](...argumentList);
                return undefined;
            },
        });
    }

    /**
     * Accept cookie banner
     *
     * @returns {Promise<void>}
     */
    async acceptCookies() {
        await this.page.waitForSelector(".cookie-banner__btn-accept");
        await this.page.click(".cookie-banner__btn-accept");
    }

    /**
     * Switch to Virtual Account
     *
     * @returns {Promise<void>}
     */
    async switchVirtualAccount() {
        await this.page.waitForSelector('.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info');
        await this.page.click('.header__menu-items > .header__menu-right > .acc-info__container > .acc-info__wrapper > .acc-info');
        const element = await this.page.evaluate(`document.querySelector('.dc-content-expander')`)
        if (element && !element.classList.contains('dc-content-expander--expanded')) {
            await this.page.click('.dc-content-expander');
        }
        const account_switcher_virtual = ".acc-switcher__wrapper > .acc-switcher__list > .dc-tabs > .dc-tabs__list > .dc-tabs__item:nth-child(2)";
        await this.page.waitForSelector(account_switcher_virtual);
        await this.page.click(account_switcher_virtual);
        await this.page.waitForSelector('.acc-switcher__id');
        await this.page.click('.acc-switcher__id');
    }

    /**
     * Set the Endpoint
     */
    async setEndpoint(url, endpoint_server, app_id) {
        await this.page.goto(`${url}/endpoint`);
        await this.page.fill('[name="server"]', endpoint_server);
        await this.page.fill('[name="app_id"]', app_id);
        await this.page.press('[name="app_id"]', 'Tab');
        await this.page.click("text=Submit");
        await this.page.waitForTimeout(300);
        await this.page.waitForLoadState('domcontentloaded');
        await qawolf.saveState(this.page, LOGIN_STATE_PATH);
    }

    /**
     * Login into the page using credentials
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async login(email, password) {
        await this.page.waitForSelector('#dt_login_button');
        await this.page.click("#dt_login_button");
        await this.page.click('[name="email"]');
        await this.page.fill('[name="email"]', email);
        await this.page.fill('[name="password"]', password);
        await this.page.click(".button");
        await this.page.waitForLoadState('domcontentloaded');
        const grant = await this.page.evaluate('document.querySelector("#btnGrant")');

        if (grant) {
            await this.page.click('#btnGrant');
            await this.page.waitForLoadState('domcontentloaded');
        }

        await qawolf.saveState(this.page, LOGIN_STATE_PATH);
    }

    async loadOrLogin(email, password) {
        const is_login_done = this.checkIfStateExists();
        if (!is_login_done) {
            await this.login(email, password);
        } else {
            await qawolf.setState(this.page, LOGIN_STATE_PATH);
            await this.page.reload();
        }
    }

    async isMobile() {
        const {width} = await this.page.viewportSize()

        return width < 400;
    }

    async navigate() {
        if (process.env.QA_SETUP === 'true') {
            await this.bypassDuo();
            await this.setEndpoint(process.env.HOME_URL, process.env.QABOX_SERVER, process.env.QABOX_APP_ID);
        }
        await this.page.goto(`${process.env.HOME_URL}`, {waitUntil: 'domcontentloaded'});
    }

    async bypassDuo() {
        await this.page.goto(`https://${process.env.QABOX_SERVER}`);
        try {
            await this.page.$eval('text=Welcome to nginx', el => el.textContent);
            return;
        } catch (e) {
            await this.page.waitForSelector('text=We need to verify your identity');
            await this.page.waitForSelector('#user_name')
            await this.page.click('#user_name')
            await this.page.fill('#user_name', process.env.QABOX_DUO_EMAIL);

            await this.page.waitForSelector('#password')
            await this.page.click('#password')
            await this.page.fill('#password', process.env.QABOX_DUO_PASSWORD);

            await this.page.waitForSelector('#duo_code')
            await this.page.click('#duo_code')
            await this.page.fill('#duo_code', process.env.QABOX_DUO_CODE);

            await this.page.waitForSelector('.body > center > .main_widget > .input_form > .login_button')
            await this.page.click('.body > center > .main_widget > .input_form > .login_button')

            await this.page.waitForSelector('text=Welcome to nginx');
        }
    }

    checkIfStateExists = () => {
        try {
            const state_path = path.resolve(LOGIN_STATE_PATH);
            const result = fs.existsSync(state_path);
            if (result) {
                const content = JSON.parse(fs.readFileSync(path.resolve(LOGIN_STATE_PATH), 'utf-8'));
                if (
                    !content.localStorage['client.accounts'] || (
                        content.localStorage['config.server_url'] &&
                        content.localStorage['config.server_url'] !== process.env.QABOX_SERVER
                    )
                ) {
                    // remove the file and allow redirection
                    fs.unlinkSync(state_path);
                    return false;
                }
            }
            return result;
        } catch (e) {
            return false;
        }
    }

    removeLoginState = () => {
        fs.unlinkSync(path.resolve(LOGIN_STATE_PATH));
    }
}

module.exports = Common;
