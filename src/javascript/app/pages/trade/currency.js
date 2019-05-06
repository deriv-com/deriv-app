const Defaults = require('./defaults');
const Currency = require('../../common/currency');
const State    = require('../../../_common/storage').State;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const displayCurrencies = () => {
    const $currency = $('.currency');

    if (!$currency.length) {
        return;
    }

    const currencies = State.getResponse('payout_currencies');

    if (currencies && currencies.length > 1) {
        $currency.html(Currency.getCurrencyList(currencies).html());
        Defaults.set('currency', $currency.val());
    } else {
        $currency.replaceWith($('<span/>', { id: $currency.attr('id'), class: $currency.attr('class'), value: currencies[0], html: Currency.formatCurrency(currencies[0]) }));
        Defaults.set('currency', currencies[0]);
    }
};

module.exports = displayCurrencies;
