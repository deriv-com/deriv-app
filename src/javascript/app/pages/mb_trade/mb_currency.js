const MBContract     = require('./mb_contract');
const MBDefaults     = require('./mb_defaults');
const formatCurrency = require('../../common/currency').formatCurrency;
const State          = require('../../../_common/storage').State;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const MBDisplayCurrencies = () => {
    const $currency    = $('.trade_form #currency');
    const $list        = $currency.find('.list');
    const $current     = $currency.find('.current');
    const currencies   = State.getResponse('payout_currencies');

    if (!$currency.length) return;
    $list.empty();
    const def_curr  = MBDefaults.get('currency');
    const def_value = def_curr && currencies.indexOf(def_curr) >= 0 ? def_curr : currencies[0];
    if (currencies.length > 1) {
        currencies.forEach((currency) => {
            $list.append($('<div/>', { value: currency, html: formatCurrency(currency) }));
            if (def_value === currency) {
                MBContract.setCurrentItem($currency, currency);
            }
        });
    }
    $current.html($('<span/>', { class: 'nav-caret' })).append(formatCurrency(def_value));
    $currency.attr('value', def_value);
    MBDefaults.set('currency', def_value);
    // if there is no currency drop down, remove hover style from currency
    if (!$list.children().length) {
        $currency.removeClass('gr-5').addClass('gr-3')
            .siblings('#payout').removeClass('gr-7').addClass('gr-9');
        $current
            .css({ 'background-color': 'white', 'border-right': 'none' })
            .hover(function () {
                $(this).css({ 'background-color': 'white', cursor: 'auto' });
            })
            .off('click')
            .find('.nav-caret').addClass('invisible').end()
            .find('.symbols:before').css({ 'margin-right': '2px' });
    }
};

module.exports = MBDisplayCurrencies;
