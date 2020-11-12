const assert = require('assert').strict;
const qawolf = require('qawolf');
const Common = require('./common');
const {waitForWSSubset} = require('../_utils/websocket');

const RECENT_POSITION_DRAWER_SELECTOR = '#dt_positions_toggle';
const MARKET_SELECT = '.cq-symbol-select-btn';
const SIMPLE_DURATION_TOGGLE_SELECTOR = '#dt_simple_duration_toggle';

class Trader extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async waitForChart() {
        await this.page.waitForSelector('.chart-container__loader', {state: 'hidden', timeout: 120000});
        await this.page.waitForSelector('.ciq-menu.ciq-enabled', {timeout: 120000});
    }

    async chooseUnderlying(code, name) {
        await this.waitForChart();
        await this.page.click(MARKET_SELECT); // Click market select
        await this.page.fill('.data-hj-whitelist', name);
        if (await this.isMobile()) {
            await this.page.click(`.market_dropdown-subcategory-item-${code}`);
        } else {
            await this.page.click(`.sc-mcd__item--${code}`);
        }
        await qawolf.assertElementText(this.page, ".cq-symbol", name);
    }

    async openRecentPositionsDrawer() {
        await this.page.waitForSelector(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.click(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.waitForSelector('positions-toggle--has-count', {state: 'hidden'});
    }

    async verifyContractResult() {
        await this.page.waitForSelector('.portfolio-empty__wrapper', {state: 'hidden'});
        await this.page.waitForSelector('.dc-result__close-btn');
        await this.page.waitForSelector('.dc-contract-card__wrapper');
    }

    async chooseContractType(trade_types, contract) {
        await this.page.click(".trade-container__fieldset.trade-types");
        await this.page.waitForSelector('.contract-type-dialog.contract-type-dialog--enterDone .contract-type-dialog__wrapper');
        await this.chooseContract(contract);
    }

    async chooseContract(contract) {
        await this.page.click(`#dt_contract_${contract}_item`);
        await this.page.waitForSelector(`span[name=contract_type][value=${contract}]`);
    }

    async setDuration(duration_unit, duration_amount) {
        await this.page.waitForSelector(SIMPLE_DURATION_TOGGLE_SELECTOR);
        if (duration_amount !== 5) {
            await this.page.click(`.range-slider__ticks span:nth-child(${duration_amount - 5})`);
        }
        if (duration_unit === 'Ticks') {
            await this.page.click('#dc_t_toggle_item');
        } else if (duration_unit === 'Minutes') {
            await this.page.click('#dc_m_toggle_item');
        }

        await qawolf.assertElementText(this.page, '#dt_range_slider_label', `${duration_amount} ${duration_unit}`);
    }

    async buyRiseContract(tradeTypes, contract, duration_unit, duration_amount) {
        await this.chooseContractType(tradeTypes, contract);
        await this.setDuration(duration_unit, duration_amount);
        await this.waitForChart();
        await this.waitForPurchaseBtnEnabled();
        await this.page.click('#dt_purchase_call_button');
        await this.verifyContractResult();
    }

    async waitForPurchaseBtnEnabled() {
        await this.page.waitForSelector('#dt_purchase_call_button:enabled', { timeout: 120000 });
        await this.page.waitForSelector('#dt_purchase_put_button:enabled', { timeout: 120000 });
    }

    async assertPurchase(duration, amount, contract_type) {
        const message = await waitForWSSubset(this.page, {
            echo_req: {
                amount,
                basis: "stake",
                contract_type,
                currency: "USD",
                duration,
                duration_unit: "t",
                proposal: 1,
            },
        });
        assert.ok(message, 'No proper proposal was found');
        assert.ok(message.echo_req.duration === duration, `Duration was not set properly, expected ${duration}, received: ${message.echo_req.duration}`);
        if (contract_type === 'CALL') {
            await this.page.click('#dt_purchase_call_price');
        } else {
            await this.page.click('#dt_purchase_put_price')
        }
        const buy_response = await waitForWSSubset(this.page, {
            echo_req: {
                price: "10.00",
            },
        });
        assert.equal(buy_response.buy.buy_price, amount, 'Buy price does not match proposal.');
    }

    async changeDuration(target) {
        if (await this.isMobile()) {
            await this.page.waitForSelector('.mobile-widget__amount');
            await this.page.click('.mobile-widget__amount');
            const current_duration = await this.page.$eval('.dc-tick-picker__holder--large', el => el.innerText);
            const steps = target - current_duration;
            await this.loopOver(steps, async () => {
                if (target > current_duration) {
                    // eslint-disable-next-line no-await-in-loop
                    await this.page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)');
                    await this.page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)');
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await this.page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)');
                    await this.page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)');
                }
            });
            await this.page.waitForSelector('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn')
            await this.page.click('.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn');
        } else {
            await this.page.waitForSelector('.trade-container__input range-slider__track');
            await this.page.waitForSelector(`[data-qa=${target}]`);
            await this.page.click(`[data-qa=${target}]`);
        }
    }

    async loopOver(range, func) {
        const steps = [...Array(Math.abs(range)).keys()];

        for (const step of steps) {
            // eslint-disable-next-line no-await-in-loop
            await func();
            // eslint-disable-next-line no-await-in-loop
            await this.waitForTimeout(150);
        }
    }
}

module.exports = Trader;
