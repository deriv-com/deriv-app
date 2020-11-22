const assert = require('assert').strict;
const qawolf = require('qawolf');
const {waitForWSSubset} = require('@root/_utils/websocket');
const Common = require('./common');

const RECENT_POSITION_DRAWER_SELECTOR = '#dt_positions_toggle';
const MARKET_SELECT = '.cq-symbol-select-btn';
const SIMPLE_DURATION_TOGGLE_SELECTOR = '#dt_simple_duration_toggle';

class Trader extends Common {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async waitForChart() {
        await this.page.waitForSelector('.chart-container__loader', { state: 'hidden', timeout: 120000 });
        await this.page.waitForSelector('.ciq-menu.ciq-enabled', { timeout: 120000 });
    }

    async chooseUnderlying(code, name) {
        await this.waitForChart();
        await this.page.click(MARKET_SELECT); // Click market select
        await this.page.fill('.data-hj-whitelist', name);
        await this.page.click(`.sc-mcd__item--${code}`);
        await qawolf.assertElementText(this.page, '.cq-symbol', name);
    }

    async openRecentPositionsDrawer() {
        await this.page.waitForSelector(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.click(RECENT_POSITION_DRAWER_SELECTOR);
        await this.page.waitForSelector('positions-toggle--has-count', { state: 'hidden' });
    }

    async verifyContractResult() {
        if (await this.isMobile()) {
            await this.assertContractDetails();
        } else {
            await this.page.waitForSelector('.portfolio-empty__wrapper', { state: 'hidden' });
            await this.page.waitForSelector('.dc-result__close-btn');
            await this.page.waitForSelector('.dc-contract-card__wrapper');
        }
    }

    async chooseContractType(trade_types, contract) {
        if (await this.isMobile()) {
            await this.page.click('#dt_contract_dropdown');
            await this.page.waitForSelector('.dc-mobile-dialog__container');
        } else {
            await this.page.click('.trade-container__fieldset.trade-types');
            await this.page.waitForSelector(
                '.contract-type-dialog.contract-type-dialog--enterDone .contract-type-dialog__wrapper'
            );
        }

        await this.chooseContract(contract);
    }

    async chooseContract(contract) {
        await this.page.click(`#dt_contract_${contract}_item`);
        await this.page.waitForSelector(`span[name=contract_type][value=${contract}]`);
    }

    async setDuration(duration_unit, duration_amount) {
        if (await this.isMobile()) {
            await this.changeDuration(duration_amount);
        } else {
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
    }

    async allowEquals(should) {
        if (await this.isMobile()) {
            try {
                if (should) {
                    if (await this.page.$eval('.dc-collapsible__icon--is-open', el => !!el)) {
                        await this.page.click('.dc-collapsible__icon--is-open');
                    }
                }
            } catch (e) {
            }

            if (should) {
                await this.page.waitForSelector('text=Equals');
                await this.page.click('text=Equals');
            }
        } else if (should) {
                await this.page.waitForSelector('.allow-equals__label');
                await this.page.click('.allow-equals__label');
            }
    }

    async buyContract(
        tradeTypes,
        contract,
        duration_unit,
        duration_amount,
        purchase_type = 'call',
        allow_equal = false
    ) {
        this.contract = contract;
        this.purchase_type = purchase_type;
        await this.chooseContractType(tradeTypes, contract);
        await this.setDuration(duration_unit, duration_amount);
        await this.allowEquals(allow_equal);
        await this.waitForPurchaseBtnEnabled(contract, allow_equal);
        await this.waitForChart();
        await this.clickOnPurchaseButton(purchase_type, allow_equal);
        await this.verifyContractResult();
    }

    async waitForPurchaseBtnEnabled(contract, allow_equal = false) {
        const is_equal = allow_equal ? 'e' : '';
        const [green, red] = this.getPurchaseBtnId(contract);
        await this.page.waitForSelector(`#dt_purchase_${green}${is_equal}_button:enabled`, { timeout: 120000 });
        await this.page.waitForSelector(`#dt_purchase_${red}${is_equal}_button:enabled`, { timeout: 120000 });
    }

    getPurchaseBtnId(contract) {
        switch (contract) {
            case 'touch':
                return ['onetouch', 'notouch'];
            case 'rise_fall':
                return ['call', 'put'];
            case 'over_under':
                return ['digitover', 'digitunder'];
            default:
                return [];
        }
    }

    async clickOnPurchaseButton(type, allow_equal = false) {
        const is_equal = allow_equal ? 'e' : '';
        const button = type + is_equal;
        await this.page.click(`#dt_purchase_${button}_button`);
    }

    async assertPurchase(duration, amount, contract_type) {
        this.duration = duration;
        // try {
        //     if (contract_type.toLowerCase().endsWith('e')) {
        //         if (await this.page.$eval('.dc-collapsible__icon--is-open', el => !!el)) {
        //             await this.page.click('.dc-collapsible__icon--is-open');
        //         }
        //     }
        // } catch (e) {
        //     if (contract_type.toLowerCase().endsWith('e')) {
        //         await this.page.waitForSelector('text=Equals');
        //         await this.page.click('text=Equals');
        //     }
        // }

        const message = await waitForWSSubset(this.page, {
            echo_req: {
                amount,
                basis: 'stake',
                contract_type: contract_type.toUpperCase(),
                currency: 'USD',
                duration,
                duration_unit: 't',
                proposal: 1,
            },
        });
        assert.ok(message, 'No proper proposal was found');
        assert.ok(
            message.echo_req.duration === duration,
            `Duration was not set properly, expected ${duration}, received: ${message.echo_req.duration}`
        );
        const buy_response = await waitForWSSubset(this.page, {
            echo_req: {
                price: '10.00',
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
                    await this.page.waitForSelector(
                        '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)'
                    );
                    await this.page.click(
                        '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(3)'
                    );
                } else {
                    // eslint-disable-next-line no-await-in-loop
                    await this.page.waitForSelector(
                        '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)'
                    );
                    await this.page.click(
                        '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__calculation > .dc-btn:nth-child(1)'
                    );
                }
            });
            await this.page.waitForSelector(
                '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn'
            );
            await this.page.click(
                '.dc-tabs__content > .trade-params__duration-tickpicker > .dc-tick-picker > .dc-tick-picker__submit-wrapper > .dc-btn'
            );
        } else {
            await this.page.waitForSelector('.trade-container__input range-slider__track');
            await this.page.waitForSelector(`[data-qa=${target}]`);
            await this.page.click(`[data-qa=${target}]`);
        }
    }

    async loopOver(range, func) {
        const steps = [...Array(Math.abs(range)).keys()];

        // eslint-disable-next-line no-restricted-syntax,no-unused-vars
        for (const step of steps) {
            // eslint-disable-next-line no-await-in-loop
            await func();
            // eslint-disable-next-line no-await-in-loop
            await this.waitForTimeout(150);
        }
    }

    async prepareAuditDetails() {
        if (await this.isMobile()) {
            await this.page.waitForSelector('#dt_positions_toggle');
            await this.page.click('#dt_positions_toggle');
            const buy_response = await waitForWSSubset(this.page, {
                echo_req: {
                    price: '10.00',
                },
            });

            await this.page.waitForTimeout(this.duration ? this.duration * 1000 : 6000);
            const contract_id = buy_response.buy.contract_id;
            await this.page.waitForSelector(`#dt_drawer_card_${contract_id}`);
            await this.page.click(`#dt_drawer_card_${contract_id}`);
            await this.page.waitForSelector('.dc-collapsible__button');
            await this.page.click('.dc-collapsible__button');
        } else {
            const buy_response = await waitForWSSubset(this.page, {
                echo_req: {
                    price: '10.00',
                },
            });
            const contract_id = buy_response.buy.contract_id;
            await this.page.waitForSelector(`#dc_contract_card_${contract_id}_result`, { timeout: 6000 });
            await this.page.hover(`#dc_contract_card_${contract_id}_result`);
            await this.page.click(`#dc_contract_card_${contract_id}_result`);
            await this.page.waitForSelector('#dt_entry_spot_label');
        }
    }

    async assertContractDetails() {
        await this.prepareAuditDetails();
        const last_proposal_open_contract_message = await waitForWSSubset(this.page, {
            echo_req: {
                proposal_open_contract: 1,
            },
        });

        if (!['over_under'].includes(this.contract)) {
            // Entry Spot check
            const entry_spot_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
                t => t.name === 'Entry Spot'
            );
            const entry_spot_displayed = await this.page.$eval(
                '#dt_entry_spot_label > div.contract-audit__item > div > span.contract-audit__value',
                el => parseFloat(el.textContent.replace(/,/, ''))
            );
            assert.equal(entry_spot_displayed, entry_spot_tick.tick);
        }

        // Start time check
        const start_time_displayed = await this.page.$eval(
            '#dt_start_time_label > div.contract-audit__item > div > span',
            el => el.textContent
        );

        const start_time_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
            t => t.name === 'Start Time'
        );
        const d = new Date(start_time_tick.epoch * 1000);
        assert.equal(
            start_time_displayed,
            `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1)
                .toString()
                .padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')} ${d
                .getUTCHours()
                .toString()
                .padStart(2, '0')}:${d
                .getUTCMinutes()
                .toString()
                .padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')} GMT`
        );

        // Exit spot check
        const exit_spot_tick = last_proposal_open_contract_message.proposal_open_contract.audit_details.all_ticks.find(
            t => t.name === 'End Time and Exit Spot'
        );
        const exit_spot_displayed = await this.page.$eval(
            '#dt_exit_spot_label > div.contract-audit__item > div > span.contract-audit__value',
            el => parseFloat(el.textContent.replace(/,/, ''))
        );
        assert.equal(exit_spot_displayed, exit_spot_tick.tick);

        // End time check
        const exit_time_displayed = await this.page.$eval(
            '#dt_exit_time_label > div.contract-audit__item > div > span',
            el => el.textContent
        );
        const end_time = new Date(exit_spot_tick.epoch * 1000);
        assert.equal(
            exit_time_displayed,
            `${end_time.getUTCFullYear()}-${(end_time.getUTCMonth() + 1)
                .toString()
                .padStart(2, '0')}-${end_time
                .getUTCDate()
                .toString()
                .padStart(2, '0')} ${end_time
                .getUTCHours()
                .toString()
                .padStart(2, '0')}:${end_time
                .getUTCMinutes()
                .toString()
                .padStart(2, '0')}:${end_time.getUTCSeconds().toString().padStart(2, '0')} GMT`
        );

        // Assert profit/loss
        await this.page.waitForSelector('text=Profit/Loss:');
        const profit = await this.page.$eval('text=Profit/Loss:', el =>
            Math.abs(parseFloat(el.nextSibling.textContent.trim()))
        );

        assert.equal(profit, Math.abs(last_proposal_open_contract_message.proposal_open_contract.profit));
    }
}

module.exports = Trader;
