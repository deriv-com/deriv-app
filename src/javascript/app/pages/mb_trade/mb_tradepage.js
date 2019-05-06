const MBContract          = require('./mb_contract');
const MBDisplayCurrencies = require('./mb_currency');
const MBTradingEvents     = require('./mb_event');
const MBPortfolio         = require('./mb_portfolio');
const MBPrice             = require('./mb_price');
const MBProcess           = require('./mb_process');
const cleanupChart        = require('../trade/charts/webtrader_chart').cleanupChart;
const BinaryPjax          = require('../../base/binary_pjax');
const Client              = require('../../base/client');
const Header              = require('../../base/header');
const BinarySocket        = require('../../base/socket');
const getDecimalPlaces    = require('../../common/currency').getDecimalPlaces;
const TopUpVirtualPopup   = require('../../pages/user/account/top_up_virtual/pop_up');
const getElementById      = require('../../../_common/common_functions').getElementById;
const State               = require('../../../_common/storage').State;
const urlFor              = require('../../../_common/url').urlFor;
const findParent          = require('../../../_common/utility').findParent;

const MBTradePage = (() => {
    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);
        BinarySocket.wait('authorize').then(init);
        if (!Client.isLoggedIn() || !Client.get('residence')) { // if client is logged out or they don't have residence set
            BinarySocket.wait('website_status').then(() => {
                BinarySocket.send({ landing_company: State.getResponse('website_status.clients_country') });
            });
        }
    };

    const init = () => {
        Header.displayAccountStatus();
        if (/^(malta|iom)$/.test(Client.get('landing_company_shortcode'))) {
            BinaryPjax.load(urlFor('trading'));
            return;
        }
        showCurrency(Client.get('currency'));

        BinarySocket.wait('landing_company', 'active_symbols').then(() => {
            if (events_initialized === 0) {
                events_initialized = 1;
                MBTradingEvents.init();
            }
        });

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            MBDisplayCurrencies();
            MBProcess.getSymbols();
        });

        State.set('is_chart_allowed', true);
        State.set('ViewPopup.onDisplayed', MBPrice.hidePriceOverlay);
        $('.container').css('max-width', '1200px');
        // if not loaded by pjax, balance update function calls TopUpVirtualPopup
        if (State.get('is_loaded_by_pjax')) {
            BinarySocket.wait('balance').then(() => {
                TopUpVirtualPopup.init(State.getResponse('balance.balance'));
            });
        }
    };

    const showCurrency = (currency) => {
        if (currency) {
            const el_payout_amount = getElementById('payout_amount');
            if (!new RegExp(currency).test(el_payout_amount.textContent)) {
                el_payout_amount.textContent += ` (${currency})`;
            }

            if (getDecimalPlaces(currency) > 2) {
                const el_category      = getElementById('category');
                const payout_wrapper   = findParent(el_payout_amount, '.gr-3');
                const category_wrapper = findParent(el_category, '.gr-9');
                if (payout_wrapper && category_wrapper) {
                    payout_wrapper.classList.remove('gr-3');
                    category_wrapper.classList.remove('gr-9');
                    payout_wrapper.classList.add('gr-4');
                    category_wrapper.classList.add('gr-8');
                }
            }
        }
    };

    const reload = () => {
        window.location.reload();
    };

    const onUnload = () => {
        if (!/trading/.test(window.location.href)) {
            Header.hideNotification('MF_RETAIL_MESSAGE');
        }
        cleanupChart();
        State.set('is_chart_allowed', false);
        MBPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        BinarySocket.clear('active_symbols');
        State.remove('ViewPopup.onDisplayed');
        $('.container').css('max-width', '');
    };

    const onDisconnect = () => {
        MBPrice.showPriceOverlay();
        cleanupChart();
        onLoad();
    };

    return {
        onLoad,
        reload,
        onUnload,
        onDisconnect,
    };
})();

module.exports = MBTradePage;
