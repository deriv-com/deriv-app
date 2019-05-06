const MBContract      = require('./mb_contract');
const MBNotifications = require('./mb_notifications');
const TradingAnalysis = require('../trade/analysis');
const redrawChart     = require('../trade/charts/webtrader_chart').redrawChart;
const ViewPopup       = require('../user/view_popup/view_popup');
const Client          = require('../../base/client');
const BinarySocket    = require('../../base/socket');
const formatMoney     = require('../../common/currency').formatMoney;
const GTM             = require('../../../_common/base/gtm');
const localize        = require('../../../_common/localize').localize;
const isEmptyObject   = require('../../../_common/utility').isEmptyObject;

/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 */

const MBPrice = (() => {
    const price_selector = '.prices-wrapper .price-rows';

    let prices         = {};
    let contract_types = {};
    let el_rows        = {};
    let barriers       = [];
    let req_id         = 0;
    let is_displayed   = false;
    let is_unwelcome   = false;

    let $table;

    const addPriceObj = (req) => {
        req.barriers.forEach((barrier_obj) => {
            const barrier = makeBarrier(barrier_obj);
            if (!prices[barrier]) {
                prices[barrier] = {};
            }
            req.contract_type.forEach((c_type) => {
                prices[barrier][c_type] = {};
                if (!contract_types[c_type]) {
                    contract_types[c_type] = MBContract.getTemplate(c_type);
                }
            });
        });
    };

    const updateTabsAndChart = () => {
        TradingAnalysis.bindAnalysisTabEvent();
        TradingAnalysis.request();
        redrawChart();
    };

    const makeBarrier = (barrier_object) => {
        if (!barrier_object.barrier && barrier_object.error) {
            // error.details will include the barrier value in case of error
            // it is intended to change the original object as we need the barrier value
            barrier_object = barrier_object.error.details; // eslint-disable-line no-param-reassign
        }
        return (barrier_object.barrier2 ? `${barrier_object.barrier2}_` : '') + barrier_object.barrier;
    };

    const display = (response) => {
        if (isEmptyObject(response.proposal_array.proposals)) { // ignore invalid responses
            updateTabsAndChart();
            return;
        }
        Object.keys(response.proposal_array.proposals).forEach((contract_type) => {
            response.proposal_array.proposals[contract_type].forEach((proposal) => {
                const barrier                  = makeBarrier(proposal);
                const prev_proposal            = $.extend({}, prices[barrier][contract_type]);
                prices[barrier][contract_type] = $.extend({ echo_req: response.echo_req }, proposal);

                // update previous ask_price to use in price movement
                if (!isEmptyObject(prev_proposal) && !prev_proposal.error) {
                    prices[barrier][contract_type].prev_price = prev_proposal.ask_price;
                }
            });
        });

        if (!is_displayed) {
            populateTable();
        }
        updatePrices();
    };

    const populateTable = () => {
        if (!$table) {
            $table = $(price_selector);
        }
        $table.off('click', 'button.price-button').on('click', 'button.price-button', processBuy);

        BinarySocket.wait('get_account_status').then((response) => {
            is_unwelcome = /unwelcome/.test(response.get_account_status.status);
            if (is_unwelcome) {
                MBNotifications.show({
                    localized_text: localize('Sorry, your account is not authorised for any further contract purchases.'),
                    uid           : 'UNWELCOME',
                    dismissible   : false,
                });
            }
        });

        if (!barriers.length) {
            barriers = Object.keys(prices).sort((a, b) => +b.split('_')[0] - (+a.split('_')[0]));
        }

        const el_price_row = document.querySelector('#templates .price-row');
        barriers.forEach((barrier) => {
            el_rows[barrier] = {};
            const el_row = el_price_row.cloneNode(true);
            el_row.setAttribute('data-barrier', barrier);
            el_row.querySelector('.barrier').innerHTML = barrier.replace(/_/g, '<br />');
            Object.keys(contract_types).forEach((contract_type) => {
                if (!el_rows[barrier][contract_type]) {
                    el_rows[barrier][contract_type] = {};
                }

                const order = contract_types[contract_type].order;
                const el_buy  = el_row.querySelectorAll('.buy-price button')[order];

                el_buy.setAttribute('data-barrier', barrier);
                el_buy.setAttribute('data-contract_type', contract_type);

                el_rows[barrier][contract_type].buy = {
                    btn: el_buy,
                    dyn: el_buy.getElementsByClassName('dynamics')[0],
                    val: el_buy.getElementsByClassName('value')[0],
                };

                updatePriceRow(getValues(prices[barrier][contract_type], contract_type));
            });
            $table.append(el_row);
        });

        hidePriceOverlay();
        MBNotifications.hideSpinnerShowTrading();
        is_displayed = true;

        // Analysis should be initialised after contents being displayed,
        // so the chart is able to get the proper container width/height
        updateTabsAndChart();
    };

    const updatePrices = () => {
        Object.keys(contract_types).forEach((contract_type) => {
            barriers.forEach((barrier) => {
                const proposal   = prices[barrier][contract_type];
                const price_rows = document.querySelectorAll(`${price_selector} div[data-barrier="${makeBarrier(proposal)}"]`);

                if (!price_rows.length) return;

                const contract_type_opp = contract_types[contract_type].opposite;

                updatePriceRow(getValues(proposal, contract_type));
                updatePriceRow(getValues(prices[barrier][contract_type_opp], contract_type_opp));
            });
        });
    };

    const getValues = (proposal, contract_type) => {
        const barrier      = makeBarrier(proposal);
        const payout       = proposal.echo_req.amount;
        const proposal_opp = prices[barrier][contract_types[contract_type].opposite];
        const time_left    = MBContract.getRemainingTime();
        return {
            contract_type,
            barrier,
            payout             : payout / 1000,
            is_active          : !proposal.error && proposal.ask_price && !is_unwelcome && time_left > 120,
            message            : proposal.error && proposal.error.code !== 'RateLimit' ? proposal.error.message : '',
            ask_price          : getAskPrice(proposal),
            sell_price         : payout - getAskPrice(proposal_opp),
            ask_price_movement : !proposal.error ? getMovementDirection(proposal.prev_price, proposal.ask_price) : '',
            sell_price_movement: proposal_opp && !proposal_opp.error ? getMovementDirection(proposal_opp.ask_price, proposal_opp.prev_price) : '',
        };
    };

    const getAskPrice = proposal => (
        // In case of RateLimit error, there is no display_value, so we display the request amount
        (proposal.error || +proposal.ask_price === 0) ? proposal.echo_req.amount : proposal.ask_price
    );

    const getMovementDirection = (prev, current) => {
        let movement = '';
        if (prev !== current) {
            movement = current > prev ? 'up' : 'down';
        }
        return movement;
    };

    const updatePriceRow = (values) => {
        const el_buy  = el_rows[values.barrier][values.contract_type].buy;

        el_buy.btn.classList[values.is_active ? 'remove' : 'add']('inactive');
        el_buy.btn[values.message ? 'setAttribute' : 'removeAttribute']('data-balloon', values.message);
        el_buy.btn[values.message ? 'setAttribute' : 'removeAttribute']('data-balloon-length', 'medium');
        el_buy.dyn.setAttribute('class', `dynamics ${values.ask_price_movement || ''}`);
        el_buy.val.textContent = formatPrice(values.ask_price);
    };

    const processBuy = (e) => {
        e.preventDefault();

        if (!Client.isLoggedIn()) {
            MBNotifications.show({ localized_text: localize('Please log in.'), uid: 'LOGIN_ERROR', dismissible: true });
            return;
        }

        let $btn = $(e.target);
        if ($btn.prop('tagName').toLowerCase() !== 'button') {
            $btn = $btn.parents('button.price-button');
        }

        if ($btn.hasClass('inactive')) return;

        const barrier       = $btn.attr('data-barrier');
        const contract_type = $btn.attr('data-contract_type');
        if (!barrier || !contract_type) return;

        showPriceOverlay();
        sendBuyRequest(barrier, contract_type);
    };

    const formatPrice = price => formatMoney(MBContract.getCurrency(), price, 1);

    const cleanup = () => {
        prices         = {};
        contract_types = {};
        barriers       = [];
        is_displayed   = false;
        el_rows        = {};
        // display loading
        if ($(price_selector).html()) {
            $('#loading-overlay').height($(price_selector).height()).setVisibility(1);
        }
        $(price_selector).html('');
    };

    const sendBuyRequest = (barrier, contract_type) => {
        const proposal = prices[barrier][contract_type];
        if (!proposal || proposal.error) return;

        const req = {
            buy       : 1,
            price     : proposal.ask_price,
            parameters: {
                contract_type,
                amount               : proposal.echo_req.amount,
                barrier              : proposal.barrier,
                basis                : 'payout',
                currency             : MBContract.getCurrency(),
                symbol               : proposal.echo_req.symbol,
                date_expiry          : proposal.echo_req.date_expiry,
                trading_period_start : proposal.echo_req.trading_period_start,
                product_type         : 'multi_barrier',
                app_markup_percentage: '0',
            },
        };

        if (proposal.barrier2) {
            req.parameters.barrier2 = proposal.barrier2;
        }

        BinarySocket.send(req).then((response) => {
            if (response.error) {
                hidePriceOverlay();
                MBNotifications.show({ localized_text: response.error.message, uid: 'BUY_ERROR', dismissible: true });
            } else {
                MBNotifications.hide('BUY_ERROR');
                ViewPopup.init($('<div />', { contract_id: response.buy.contract_id }).get(0));
                GTM.pushPurchaseData(response);
            }
        });
    };

    const showPriceOverlay = () => {
        $('#disable-overlay').setVisibility(1);
        $('#loading-overlay').setVisibility(0);
    };

    const hidePriceOverlay = () => {
        $('#disable-overlay').setVisibility(0);
        $('#loading-overlay').setVisibility(0);
    };

    return {
        display,
        addPriceObj,
        cleanup,
        showPriceOverlay,
        hidePriceOverlay,

        getReqId     : () => req_id,
        increaseReqId: () => { req_id++; cleanup(); },
        getPrices    : () => prices,
        onUnload     : () => { cleanup(); req_id = 0; $table = undefined; },
    };
})();

module.exports = MBPrice;
