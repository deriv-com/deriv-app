const Common = require('./common');

class Trader extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`${process.env.HOME_URL}/`);
    }

    async openRecentPositionsDrawer() {
        await this.page.click('#dt_positions_toggle');
    }

    async waitForChart() {
        await this.page.waitForSelector('.chart-container__loader', {state: 'hidden', timeout: 120000});
        await this.page.waitForSelector('.ciq-menu.ciq-enabled', {timeout: 120000});
    }
}

module.exports = Trader;
