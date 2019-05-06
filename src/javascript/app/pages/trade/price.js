const moment               = require('moment');
const commonTrading        = require('./common');
const displayPriceMovement = require('./common_independent').displayPriceMovement;
const getStartDateNode     = require('./common_independent').getStartDateNode;
const getTradingTimes      = require('./common_independent').getTradingTimes;
const Contract             = require('./contract');
const Defaults             = require('./defaults');
const getLookBackFormula   = require('./lookback').getFormula;
const isLookback           = require('./lookback').isLookback;
const Client               = require('../../base/client');
const BinarySocket         = require('../../base/socket');
const formatMoney          = require('../../common/currency').formatMoney;
const CommonFunctions      = require('../../../_common/common_functions');
const localize             = require('../../../_common/localize').localize;
const getPropertyValue     = require('../../../_common/utility').getPropertyValue;

/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 *
 * Usage:
 *
 * `socket.send(Price.proposal())` to send price proposal to server
 * `Price.display()` to display the price details returned from server
 */
const Price = (() => {
    let type_display_id_mapping = {};
    let form_id                 = 0;
    let is_resubscribing        = false;

    const createProposal = (type_of_contract) => {
        const proposal = {
            proposal : 1,
            subscribe: 1,
        };

        const contract_type = type_of_contract;
        const start_date    = getStartDateNode();
        const start_time    = CommonFunctions.getElementById('time_start');
        const underlying    = CommonFunctions.getElementById('underlying');
        const amount_type   = CommonFunctions.getElementById('amount_type');
        const currency      = CommonFunctions.getVisibleElement('currency');
        const payout        = CommonFunctions.getElementById('amount');
        const expiry_type   = CommonFunctions.getElementById('expiry_type');
        const duration      = CommonFunctions.getElementById('duration_amount');
        const duration_unit = CommonFunctions.getElementById('duration_units');
        const end_date      = CommonFunctions.getElementById('expiry_date');
        const barrier       = CommonFunctions.getElementById('barrier');
        const high_barrier  = CommonFunctions.getElementById('barrier_high');
        const low_barrier   = CommonFunctions.getElementById('barrier_low');
        const prediction    = CommonFunctions.getElementById('prediction');
        const selected_tick = CommonFunctions.getElementById('selected_tick');
        const multiplier    = CommonFunctions.getElementById('multiplier');

        if (payout && CommonFunctions.isVisible(payout) && payout.value) {
            proposal.amount = parseFloat(payout.value);
        }

        if (multiplier && CommonFunctions.isVisible(multiplier) && multiplier.value) {
            const multiplier_value = parseFloat(multiplier.value);
            proposal.amount = multiplier_value;
            if (multiplier_value > 1000) {
                proposal.error = {
                    message: localize('Maximum multiplier of 1000.'),
                };
            }
        }

        if (amount_type && CommonFunctions.isVisible(amount_type) && amount_type.value
            && !isLookback(type_of_contract)) {
            proposal.basis = amount_type.value;
        }

        if (isLookback(type_of_contract)) {
            proposal.basis = 'multiplier';
        }

        if (contract_type) {
            proposal.contract_type = type_of_contract;
        }

        if (currency && (currency.value || currency.getAttribute('value'))) {
            proposal.currency = currency.value || currency.getAttribute('value');
        }

        if (underlying && underlying.value) {
            proposal.symbol = underlying.value;
        }

        if (start_date && CommonFunctions.isVisible(start_date) && start_date.value !== 'now') {
            const time     = start_time.value.split(':');
            const set_time = moment.utc(Number(start_date.value) * 1000).hour(time[0]).minute(time[1]);

            proposal.date_start = set_time ? set_time.unix() : undefined;
        }

        if (expiry_type && CommonFunctions.isVisible(expiry_type) && expiry_type.value === 'duration') {
            proposal.duration      = parseInt(duration.value);
            proposal.duration_unit = duration_unit.value;
        } else if (expiry_type && CommonFunctions.isVisible(expiry_type) && expiry_type.value === 'endtime') {
            const end_date2 = end_date.getAttribute('data-value');
            let end_time2   = Defaults.get('expiry_time');
            if (!end_time2) {
                const trading_times = getTradingTimes();
                const trading_times_end_date2 = getPropertyValue(trading_times, [end_date2, underlying.value]);
                if (trading_times_end_date2 && trading_times_end_date2.length && trading_times_end_date2[0] !== '--') {
                    if (trading_times_end_date2.length > 1) {
                        end_time2 = trading_times_end_date2[1];
                    } else {
                        end_time2 = trading_times_end_date2;
                    }
                }
            }

            proposal.date_expiry   = moment.utc(`${end_date2} ${(end_time2 || '23:59:59')}`).unix();
            // For stopping tick trade behaviour
            proposal.duration_unit = 'm';
        }

        if (barrier && CommonFunctions.isVisible(barrier) && barrier.value) {
            proposal.barrier = barrier.value;
        }

        if (high_barrier && CommonFunctions.isVisible(high_barrier) && high_barrier.value) {
            proposal.barrier = high_barrier.value;
        }

        if (low_barrier && CommonFunctions.isVisible(low_barrier) && low_barrier.value) {
            proposal.barrier2 = low_barrier.value;
        }

        if (prediction && CommonFunctions.isVisible(prediction)) {
            proposal.barrier = parseInt(prediction.value);
        }

        if (selected_tick && CommonFunctions.isVisible(selected_tick)) {
            proposal.selected_tick = parseInt(selected_tick.value);
            // the only possibility for duration and duration tick is 5 ticks
            // so we show a label and directly pass those values here
            proposal.duration      = Defaults.get('duration_amount');
            proposal.duration_unit = Defaults.get('duration_units');
        }

        if (contract_type) {
            proposal.contract_type = type_of_contract;
        }

        proposal.passthrough = {
            form_id,
        };

        commonTrading.resetPriceMovement();

        return proposal;
    };

    const display = (details, contract_type) => {
        const proposal = details.proposal;
        const id       = proposal ? proposal.id : '';
        const params   = details.echo_req;

        let type = params.contract_type;
        if (id && !type) {
            type = type_display_id_mapping[id];
        }

        if (params && id && Object.getOwnPropertyNames(params).length > 0) {
            type_display_id_mapping[id] = type;
        }

        const position = commonTrading.contractTypeDisplayMapping(type);

        if (!position) {
            return;
        }

        const container = CommonFunctions.getElementById(`price_container_${position}`);
        if (!container) return;
        if (!$(container).is(':visible')) {
            $(container).fadeIn(200);
        }

        const h4                  = container.getElementsByClassName('contract_heading')[0];
        const amount              = container.getElementsByClassName('contract_amount')[0];
        const payout_amount       = container.getElementsByClassName('contract_payout')[0];
        const contract_multiplier = container.getElementsByClassName('contract_multiplier')[0];
        const stake               = container.getElementsByClassName('stake')[0];
        const payout              = container.getElementsByClassName('payout')[0];
        const multiplier          = container.getElementsByClassName('multiplier')[0];
        const purchase            = container.getElementsByClassName('purchase_button')[0];
        const description         = container.getElementsByClassName('contract_description')[0];
        const longcode            = container.getElementsByClassName('contract_longcode')[0];
        const comment             = container.getElementsByClassName('price_comment')[0];
        const error               = container.getElementsByClassName('contract_error')[0];
        const currency            = CommonFunctions.getVisibleElement('currency');

        if (!h4) return;
        const display_text = type && contract_type ? contract_type[type] : '';
        if (display_text) {
            h4.setAttribute('class', `contract_heading ${type}`);
            CommonFunctions.elementTextContent(h4, display_text);
        }

        const setData = (data = {}) => {
            if (!data.display_value) {
                amount.classList.remove('price_moved_up', 'price_moved_down');
            }
            CommonFunctions.elementTextContent(stake, `${localize('Stake')}: `);
            CommonFunctions.elementInnerHtml(amount, data.display_value ? formatMoney((currency.value || currency.getAttribute('value')), data.display_value) : '-');

            if (!data.payout) {
                amount.classList.remove('price_moved_up', 'price_moved_down');
            }
            CommonFunctions.elementTextContent(payout, `${localize('Payout')}: `);
            CommonFunctions.elementInnerHtml(payout_amount, data.payout ? formatMoney((currency.value || currency.getAttribute('value')), data.payout) : '-');
            // Lookback multiplier
            CommonFunctions.elementTextContent(multiplier, `${localize('Multiplier')}: `);
            CommonFunctions.elementInnerHtml(contract_multiplier, data.multiplier ? formatMoney((currency.value || currency.getAttribute('value')), data.multiplier, false, 3, 2) : '-');

            if (data.longcode && window.innerWidth > 500) {
                if (description) description.setAttribute('data-balloon', data.longcode);
                if (longcode) CommonFunctions.elementTextContent(longcode, data.longcode);
            } else {
                if (description) description.removeAttribute('data-balloon');
                if (longcode) CommonFunctions.elementTextContent(longcode, '');
            }
        };

        const setPurchaseStatus = (enable) => {
            purchase.parentNode.classList[enable ? 'remove' : 'add']('button-disabled');
        };

        if (details.error) {
            setPurchaseStatus(0);
            comment.hide();
            setData();
            error.show();
            CommonFunctions.elementTextContent(error, details.error.message);
        } else {
            setData(proposal);
            if ($('#websocket_form').find('.error-field:visible').length > 0) {
                setPurchaseStatus(0);
            } else {
                setPurchaseStatus(1);
            }
            comment.show();
            error.hide();
            if (isLookback(type)) {
                const multiplier_value = formatMoney(Client.get('currency'), proposal.multiplier, false, 3, 2);
                CommonFunctions.elementInnerHtml(comment, `${localize('Payout')}: ${getLookBackFormula(type, multiplier_value)}`);
            } else {
                commonTrading.displayCommentPrice(comment, (currency.value || currency.getAttribute('value')), proposal.ask_price, proposal.payout);
            }
            const old_price  = purchase.getAttribute('data-display_value');
            const old_payout = purchase.getAttribute('data-payout');
            if (amount) displayPriceMovement(amount, old_price, proposal.display_value);
            if (payout_amount) displayPriceMovement(payout_amount, old_payout, proposal.payout);
            purchase.setAttribute('data-purchase-id', id);
            purchase.setAttribute('data-ask-price', proposal.ask_price);
            purchase.setAttribute('data-display_value', proposal.display_value);
            purchase.setAttribute('data-payout', proposal.payout);
            purchase.setAttribute('data-symbol', id);
            Object.keys(params).forEach((key) => {
                if (key && key !== 'proposal') {
                    purchase.setAttribute(`data-${key}`, params[key]);
                }
            });
        }
    };

    const clearMapping = () => {
        type_display_id_mapping = {};
    };

    const clearFormId = () => {
        form_id = 0;
    };

    /*
     * Function to request for cancelling the current price proposal
     */
    const processForgetProposals = () => {
        commonTrading.showPriceOverlay();
        const forget_proposal = BinarySocket.send({ forget_all: 'proposal' });
        forget_proposal.then(() => {
            Price.clearMapping();
        });
        return forget_proposal;
    };

    const processForgetProposalOpenContract = () =>
        BinarySocket.send({ forget_all: 'proposal_open_contract' });

    /*
     * Function to process and calculate price based on current form
     * parameters or change in form parameters
     */
    const processPriceRequest = (has_resubscribed) => {
        Price.incrFormId();
        commonTrading.showPriceOverlay();
        let types = Contract.contractType()[Contract.form()];
        if (Contract.form() === 'digits') {
            switch (sessionStorage.getItem('formname')) {
                case 'matchdiff':
                    types = {
                        DIGITMATCH: 1,
                        DIGITDIFF : 1,
                    };
                    break;
                case 'evenodd':
                    types = {
                        DIGITEVEN: 1,
                        DIGITODD : 1,
                    };
                    break;
                case 'overunder':
                    types = {
                        DIGITOVER : 1,
                        DIGITUNDER: 1,
                    };
                    break;
                default:
                    break;
            }
        }

        if (Contract.form() === 'lookback') {
            switch (sessionStorage.getItem('formname')) {
                case 'lookbackhigh':
                    types = {
                        LBFLOATPUT: 1,
                    };
                    break;
                case 'lookbacklow':
                    types = {
                        LBFLOATCALL: 1,
                    };
                    break;
                case 'lookbackhighlow':
                    types = {
                        LBHIGHLOW: 1,
                    };
                    break;
                default:
                    break;
            }
        }

        processForgetProposalOpenContract();
        processForgetProposals().then(() => {
            const position_is_visible = {
                top   : false,
                middle: false,
                bottom: false,
            };
            let first_price_proposal = true;
            Object.keys(types || {}).forEach((type_of_contract) => {
                const position = commonTrading.contractTypeDisplayMapping(type_of_contract);
                const proposal = Price.proposal(type_of_contract);
                position_is_visible[position] = true;

                if (proposal.error) {
                    proposal.echo_req = proposal;
                    Price.display(proposal, Contract.contractType()[Contract.form()]);
                    commonTrading.hidePriceOverlay();
                } else {
                    BinarySocket.send(proposal, { callback: (response) => {
                        if (response.error && response.error.code === 'AlreadySubscribed' && !is_resubscribing) {
                            commonTrading.showPriceOverlay();
                            // the already subscribed error from the second proposal request will trigger this error again
                            // and we will get stuck in a loop of resubscribing twice and getting this error again unless we resubscribe exactly once
                            is_resubscribing = true;
                            processPriceRequest(true);
                        } else if (response.echo_req && response.echo_req !== null && response.echo_req.passthrough &&
                            response.echo_req.passthrough.form_id === form_id) {
                            Price.display(response, Contract.contractType()[Contract.form()]);
                        }
                        if ((!response.error || response.error.code !== 'AlreadySubscribed') && first_price_proposal) {
                            commonTrading.hideOverlayContainer();
                            commonTrading.hidePriceOverlay();
                            setPriceContainersVisibility(position_is_visible);
                            first_price_proposal = false;
                        }
                    } });
                }
            });
            if (has_resubscribed) {
                // after we have resubscribed once, we can clear this for the next usage
                is_resubscribing = false;
            }
        });
    };

    const setPriceContainersVisibility = (position_is_visible) => {
        Object.keys(position_is_visible).forEach(position => {
            const container = CommonFunctions.getElementById(`price_container_${position}`);
            if (position_is_visible[position]) {
                $(container).fadeIn(0);
            } else {
                $(container).fadeOut(0);
            }
        });
    };

    return {
        display,
        clearMapping,
        clearFormId,
        processForgetProposals,
        processForgetProposalOpenContract,
        processPriceRequest,

        proposal        : createProposal,
        idDisplayMapping: () => type_display_id_mapping,
        incrFormId      : () => { form_id++; },
    };
})();

module.exports = Price;
