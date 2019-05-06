const moment      = require('moment');
const Client      = require('../../../../base/client');
const formatMoney = require('../../../../common/currency').formatMoney;

const ProfitTable = (() => {
    const getProfitTabletData = (transaction) => {
        const currency     = Client.get('currency');
        const buy_moment   = moment.utc(transaction.purchase_time * 1000);
        const sell_moment  = moment.utc(transaction.sell_time * 1000);
        const buy_price    = parseFloat(transaction.buy_price);
        const sell_price   = parseFloat(transaction.sell_price);

        return {
            buyDate  : `${buy_moment.format('YYYY-MM-DD')}\n${buy_moment.format('HH:mm:ss')} GMT`,
            ref      : transaction.transaction_id,
            payout   : +transaction.payout ? formatMoney(currency, parseFloat(transaction.payout), true) : '-',
            buyPrice : formatMoney(currency, buy_price, true),
            sellDate : `${sell_moment.format('YYYY-MM-DD')}\n${sell_moment.format('HH:mm:ss')} GMT`,
            sellPrice: formatMoney(currency, sell_price, true),
            pl       : formatMoney(currency, Number(sell_price - buy_price), true),
            desc     : transaction.longcode,
            id       : transaction.contract_id,
            app_id   : transaction.app_id,
            shortcode: transaction.shortcode,
        };
    };

    return {
        getProfitTabletData,
    };
})();

module.exports = ProfitTable;
