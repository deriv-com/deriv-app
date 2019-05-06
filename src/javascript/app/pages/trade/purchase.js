const moment              = require('moment');
const isCallputspread     = require('./callputspread').isCallputspread;
const Contract            = require('./contract');
const hidePriceOverlay    = require('./common').hidePriceOverlay;
const countDecimalPlaces  = require('./common_independent').countDecimalPlaces;
const getLookBackFormula  = require('./lookback').getFormula;
const isLookback          = require('./lookback').isLookback;
const processPriceRequest = require('./price').processPriceRequest;
const Symbols             = require('./symbols');
const DigitTicker         = require('./digit_ticker');
const Tick                = require('./tick');
const TickDisplay         = require('./tick_trade');
const updateValues        = require('./update_values');
const Client              = require('../../base/client');
const Header              = require('../../base/header');
const BinarySocket        = require('../../base/socket');
const formatMoney         = require('../../common/currency').formatMoney;
const TopUpVirtualPopup   = require('../../pages/user/account/top_up_virtual/pop_up');
const addComma            = require('../../../_common/base/currency_base').addComma;
const CommonFunctions     = require('../../../_common/common_functions');
const localize            = require('../../../_common/localize').localize;
const State               = require('../../../_common/storage').State;
const padLeft             = require('../../../_common/string_util').padLeft;
const urlFor              = require('../../../_common/url').urlFor;
const createElement       = require('../../../_common/utility').createElement;
const getPropertyValue    = require('../../../_common/utility').getPropertyValue;

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const Purchase = (() => {
    let purchase_data = {};
    let tick_config   = {};

    let payout_value,
        cost_value,
        profit_value,
        status,
        contract_duration;

    const replaceElement = (container, child) => {
        container.querySelectorAll('.row').forEach(item => item.classList.add('invisible'));
        // Count up to the number instead of just replacing it.
        if (Array.from(container.querySelectorAll('.row.digit-trade')).length > 0) {
            const this_quote_el = child.querySelector('.quote');
            container.append(child);
            if (this_quote_el.parentElement.parentElement.previousSibling) {
                const prev_quote_el = this_quote_el.parentElement.parentElement.previousSibling.querySelector('.quote');
                const prev_quote = prev_quote_el.innerText;
                DigitTicker.countUp(prev_quote,
                    parseFloat(this_quote_el.innerText.replace(/,+/, '')),
                    700,
                    this_quote_el,
                    (content) => `<div class='quote'>${addComma(content, countDecimalPlaces(content)).replace(/\d$/, makeBold)}</div>`,
                );
            }
        } else {
            container.append(child);
        }
    };

    const display = (details) => {
        purchase_data = details;
        status        = '';

        const receipt             = details.buy;
        const passthrough         = details.echo_req.passthrough;
        const container           = CommonFunctions.getElementById('contract_confirmation_container');
        const message_container   = CommonFunctions.getElementById('confirmation_message');
        const heading             = CommonFunctions.getElementById('contract_purchase_heading');
        const descr               = CommonFunctions.getElementById('contract_purchase_descr');
        const barrier_element     = CommonFunctions.getElementById('contract_purchase_barrier');
        const reference           = CommonFunctions.getElementById('contract_purchase_reference');
        const chart               = CommonFunctions.getElementById('trade_tick_chart');
        const payout              = CommonFunctions.getElementById('contract_purchase_payout');
        const cost                = CommonFunctions.getElementById('contract_purchase_cost');
        const profit              = CommonFunctions.getElementById('contract_purchase_profit');
        const spots               = CommonFunctions.getElementById('contract_purchase_spots');
        const confirmation_error  = CommonFunctions.getElementById('confirmation_error');
        const authorization_error = CommonFunctions.getElementById('authorization_error_container');
        const contracts_list      = CommonFunctions.getElementById('contracts_list');
        const button              = CommonFunctions.getElementById('contract_purchase_button');

        const error      = details.error;
        const has_chart  = !/^digits$/.test(Contract.form());
        const show_chart = !error && passthrough.duration <= 10 && passthrough.duration_unit === 't';
        contract_duration = details.echo_req.passthrough.duration;

        if (error) {
            const balance = State.getResponse('balance.balance');
            confirmation_error.show();

            if (/InsufficientBalance/.test(error.code) && TopUpVirtualPopup.shouldShow(balance, true)) {
                hidePriceOverlay();
                processPriceRequest();
                TopUpVirtualPopup.show(error.message);
            } else {
                contracts_list.style.display = 'none';
                container.style.display = 'block';
                message_container.hide();
                if (/AuthorizationRequired/.test(error.code)) {
                    authorization_error.setVisibility(1);
                    const authorization_error_btn_login = CommonFunctions.getElementById('authorization_error_btn_login');
                    authorization_error_btn_login.removeEventListener('click', loginOnClick);
                    authorization_error_btn_login.addEventListener('click', loginOnClick);
                } else {
                    BinarySocket.wait('get_account_status').then(response => {
                        confirmation_error.setVisibility(1);
                        let message = error.message;
                        if (/NoMFProfessionalClient/.test(error.code)) {
                            const account_status = getPropertyValue(response, ['get_account_status', 'status']) || [];
                            const has_professional_requested = account_status.includes('professional_requested');
                            const has_professional_rejected  = account_status.includes('professional_rejected');
                            if (has_professional_requested) {
                                message = localize('Your application to be treated as a professional client is being processed.');
                            } else if (has_professional_rejected) {
                                const message_text = `${localize('Your professional client request is [_1]not approved[_2].', ['<strong>', '</strong>'])}<br />${localize('Please reapply once the required criteria has been fulfilled.')}<br /><br />${localize('More information can be found in an email sent to you.')}`;
                                const button_text  = localize('I want to reapply');

                                message = prepareConfirmationErrorCta(message_text, button_text, true);
                            } else {
                                const message_text = localize('In the EU, financial binary options are only available to professional investors.');
                                const button_text  = localize('Apply now as a professional investor');

                                message = prepareConfirmationErrorCta(message_text, button_text);
                            }
                        } else if (/RestrictedCountry/.test(error.code)) {
                            let additional_message = '';
                            if (/FinancialBinaries/.test(error.code)) {
                                additional_message = localize('Try our [_1]Volatility Indices[_2].', [`<a href="${urlFor('get-started/binary-options', 'anchor=volatility-indices#range-of-markets')}" >`, '</a>']);
                            } else if (/Random/.test(error.code)) {
                                additional_message = localize('Try our other markets.');
                            }
                            message = `${error.message}. ${additional_message}`;
                        }
                        CommonFunctions.elementInnerHtml(confirmation_error, message);
                    });
                }
            }
        } else {
            contracts_list.style.display = 'none';
            CommonFunctions.getElementById('guideBtn').style.display = 'none';
            container.style.display = 'table-row';
            message_container.show();
            authorization_error.setVisibility(0);
            confirmation_error.setVisibility(0);

            CommonFunctions.elementTextContent(heading, localize('Contract Confirmation'));
            CommonFunctions.elementTextContent(descr, receipt.longcode);
            CommonFunctions.elementTextContent(barrier_element, '');
            CommonFunctions.elementTextContent(reference, `${localize('Your transaction reference is')} ${receipt.transaction_id}`);

            const currency = Client.get('currency');
            let formula, multiplier;
            const { contract_type } = passthrough;
            if (isLookback(contract_type)) {
                multiplier = formatMoney(currency, passthrough.amount, false, 3, 2);
                formula    = getLookBackFormula(contract_type, multiplier);
            }

            payout_value = +receipt.payout;
            cost_value   = receipt.buy_price;

            const potential_profit_value = payout_value ? formatMoney(currency, payout_value - cost_value) : undefined;

            CommonFunctions.elementInnerHtml(cost,   `${localize('Total Cost')} <p>${formatMoney(currency, cost_value)}</p>`);
            if (isLookback(contract_type)) {
                CommonFunctions.elementInnerHtml(payout, `${localize('Potential Payout')} <p>${formula}</p>`);
                profit.setVisibility(0);
            } else if (isCallputspread(contract_type)) {
                profit.setVisibility(1);
                CommonFunctions.elementInnerHtml(payout, `${localize('Maximum Payout')} <p>${formatMoney(currency, payout_value)}</p>`);
                CommonFunctions.elementInnerHtml(profit, `${localize('Maximum Profit')} <p>${potential_profit_value}</p>`);
            } else {
                profit.setVisibility(1);
                CommonFunctions.elementInnerHtml(payout, `${localize('Potential Payout')} <p>${formatMoney(currency, payout_value)}</p>`);
                CommonFunctions.elementInnerHtml(profit, `${localize('Potential Profit')} <p>${potential_profit_value}</p>`);
            }

            updateValues.updateContractBalance(receipt.balance_after);

            if (show_chart && has_chart) {
                chart.show();
            } else {
                chart.hide();
            }

            tick_config = {
                is_digit: /^digit/i.test(contract_type),
            };

            if (has_chart) {
                spots.hide();
            } else {
                CommonFunctions.elementTextContent(spots, '');
                spots.className = '';
                spots.show();
            }

            if (has_chart && !show_chart) {
                CommonFunctions.elementTextContent(button, localize('View'));
                button.setAttribute('contract_id', receipt.contract_id);
                button.show();
                $('#confirmation_message_container .open_contract_details').attr('contract_id', receipt.contract_id).setVisibility(1);
            } else {
                button.hide();
                $('#confirmation_message_container .open_contract_details').setVisibility(0);
            }
        }

        if (tick_config.is_digit && show_chart) {
            DigitTicker.init('digit_ticker_table', passthrough.contract_type, receipt.shortcode, passthrough.duration, status);
        } else {
            DigitTicker.remove();
        }

        if (show_chart && has_chart) {
            // calculate number of decimals needed to display tick-chart according to the spot
            // value of the underlying
            let decimal_points     = 2;
            const tick_spots       = Tick.spots();
            const tick_spot_epochs = Object.keys(tick_spots);
            if (tick_spot_epochs.length > 0) {
                const last_quote = tick_spots[tick_spot_epochs[0]].toString();

                if (last_quote.indexOf('.') !== -1) {
                    decimal_points = last_quote.split('.')[1].length;
                }
            }

            let category = sessionStorage.getItem('formname');
            if (/^(risefall|higherlower)$/.test(category)) {
                category = 'callput';
            }

            TickDisplay.init({
                symbol              : passthrough.symbol,
                barrier             : /^(higherlower|touchnotouch)$/.test(sessionStorage.getItem('formname')) ? passthrough.barrier : undefined,
                number_of_ticks     : passthrough.duration,
                previous_tick_epoch : receipt.start_time,
                contract_category   : category,
                display_symbol      : Symbols.getName(passthrough.symbol),
                contract_start      : receipt.start_time,
                display_decimals    : decimal_points,
                price               : passthrough['ask-price'],
                payout              : receipt.payout,
                shortcode           : receipt.shortcode,
                show_contract_result: 1,
                width               : $('#confirmation_message').width(),
                id_render           : 'trade_tick_chart',
            });
            TickDisplay.resetSpots();
        }

        if (show_chart) {
            const request = {
                proposal_open_contract: 1,
                contract_id           : receipt.contract_id,
                subscribe             : 1,
            };
            BinarySocket.send(request, { callback: (response) => {
                const contract = response.proposal_open_contract;
                if (contract) {
                    status = contract.status;
                    profit_value = contract.profit;
                    TickDisplay.setStatus(contract);
                    if (/^digit/i.test(contract.contract_type)) {
                        if (contract.status !== 'open') {
                            digitShowExitTime(contract.status, contract.exit_tick);
                        }
                    }
                    if (!/^digit/i.test(contract.contract_type) && contract.exit_tick_time && +contract.exit_tick_time < contract.date_expiry) {
                        TickDisplay.updateChart({ is_sold: true }, contract);
                    }

                    // force to sell the expired contract, in order to get the final status
                    if (+contract.is_settleable === 1 && !contract.is_sold) {
                        sellExpired();
                    }
                }
            } });
        }
    };

    const sellExpired = () => BinarySocket.send({ sell_expired: 1 });

    const makeBold = d => `<strong>${d}</strong>`;

    const prepareConfirmationErrorCta = (message_text, button_text, has_html = false) => {
        const row_element = createElement('div', { class: 'gr-row font-style-normal' });
        const columnElement = (extra_attributes = {}) => createElement('div', { class: 'gr-12 gr-padding-20', ...extra_attributes });
        const button_element = createElement('a', { class: 'button', href: urlFor('user/settings/professional') });
        const cta_element = columnElement();
        let message_element;

        if (has_html) {
            message_element = columnElement();
            message_element.innerHTML = message_text;
        } else {
            message_element = columnElement({ text: message_text });
        }
        
        button_element.appendChild(createElement('span', { text: button_text }));
        cta_element.appendChild(button_element);
        row_element.appendChild(message_element);
        row_element.appendChild(cta_element);

        return row_element.outerHTML;
    };

    const loginOnClick = (e) => Header.loginOnClick(e);

    const onclose = () => {
        DigitTicker.remove();
    };

    const updateSpotList = () => {
        const $spots = $('#contract_purchase_spots');
        if (!$spots.length || $spots.is(':hidden')) {
            return;
        }

        const spots = CommonFunctions.getElementById('contract_purchase_spots');
        if (status && status !== 'open') {
            if (!new RegExp(status).test(spots.classList)) {
                if (!tick_config.is_digit) {
                    spots.className = status;
                }
                if (status === 'won') {
                    updateValues.updatePurchaseStatus(payout_value, cost_value, profit_value, localize('This contract won'));
                } else if (status === 'lost') {
                    updateValues.updatePurchaseStatus(0, -cost_value, profit_value, localize('This contract lost'));
                }
            }
        }

        let duration = +getPropertyValue(purchase_data, ['echo_req', 'passthrough', 'duration']);

        if (!duration) {
            return;
        }

        const spots2  = Tick.spots();
        const epoches = Object.keys(spots2).sort((a, b) => a - b);

        CommonFunctions.elementTextContent(spots, '');
        for (let s = 0; s < epoches.length; s++) {
            const tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]],
            };

            if (CommonFunctions.isVisible(spots) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time) {
                const current_tick_count = spots.getElementsByClassName('row').length + 1;
                if (contract_duration && +contract_duration < current_tick_count) {
                    sellExpired();
                    duration = 0;
                    break;
                }

                const fragment = createElement('div', { class: `row${tick_config.is_digit ? ' digit-trade' : ''}` });

                const el1 = createElement('div', { class: 'col', text: `${localize('Tick')} ${current_tick_count}` });

                if (!tick_config.is_digit) {
                    fragment.appendChild(el1);
                }

                const el2     = createElement('div', { class: 'col' });
                const date    = new Date(tick_d.epoch * 1000);
                const hours   = padLeft(date.getUTCHours(), 2, '0');
                const minutes = padLeft(date.getUTCMinutes(), 2, '0');
                const seconds = padLeft(date.getUTCSeconds(), 2, '0');
                CommonFunctions.elementTextContent(el2, [hours, minutes, seconds].join(':'));
                if (!tick_config.is_digit) {
                    fragment.appendChild(el2);
                }
                const tick_with_comma = addComma(tick_d.quote, countDecimalPlaces(tick_d.quote));
                const tick = `<div class='quote'>${tick_with_comma.replace(/\d$/, makeBold)}</div>`;
                const el3  = createElement('div', { class: 'col' });
                CommonFunctions.elementInnerHtml(el3, tick);

                if (tick_config.is_digit) {
                    DigitTicker.update(current_tick_count, tick_d);
                    const el_epoch = document.createElement('div');
                    el_epoch.className = 'digit-tick-epoch';
                    el_epoch.style.right = (el3.offsetWidth - tick.offsetWidth) / 2;
                    const el_epoch_content = document.createTextNode(
                        moment(new Date(tick_d.epoch * 1000)).utc().format('HH:mm:ss')
                    );
                    el_epoch.appendChild(el_epoch_content);
                    fragment.appendChild(el_epoch);
                    el3.insertBefore(el_epoch, el3.childNodes[0]);

                    replaceElement(fragment, el3);
                    replaceElement(spots, fragment);
                } else if (!tick_config.is_digit) {
                    fragment.appendChild(el3);
                    spots.appendChild(fragment);
                }

                spots.scrollTop = spots.scrollHeight;

                duration--;

                if (!duration) {
                    purchase_data.echo_req.passthrough.duration = 0;
                }
            }
        }
    };

    const digitShowExitTime = (contract_status, last_tick_quote) => {
        const are_spots_rendered = CommonFunctions.getElementById('contract_purchase_spots')
            .getElementsByClassName('row').length;
        if (!are_spots_rendered) {
            updateSpotList();
        }
        const el_container = CommonFunctions.getElementById('contract_purchase_spots');
        const el_epoch = Array.from(el_container.querySelectorAll('.digit-tick-epoch')).pop();
        const adjustment = 5;
        if (el_epoch && el_epoch.classList) {
            el_epoch.classList.add('is-visible');
            el_epoch.setAttribute('style', `position: absolute; right: ${((el_epoch.parentElement.offsetWidth - el_epoch.nextSibling.offsetWidth) / 2) + adjustment}px`);
            const last_digit_quote = last_tick_quote ? last_tick_quote.slice(-1) : '';
            if (contract_status === 'won') {
                DigitTicker.markAsWon();
                DigitTicker.markDigitAsWon(last_digit_quote);
            }
            if (contract_status === 'lost') {
                DigitTicker.markAsLost();
                DigitTicker.markDigitAsLost(last_digit_quote);
            }
        }
    };

    return {
        display,
        onclose,
        updateSpotList,
    };
})();

module.exports = Purchase;
