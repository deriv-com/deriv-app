const moment         = require('moment');
const Client         = require('../../../../base/client');
const formatCurrency = require('../../../../common/currency').formatCurrency;
const formatMoney    = require('../../../../common/currency').formatMoney;
const localize       = require('../../../../../_common/localize').localize;
const toTitleCase    = require('../../../../../_common/string_util').toTitleCase;

const Statement = (() => {
    const getStatementData = (statement, currency) => {
        const date_obj   = new Date(statement.transaction_time * 1000);
        const moment_obj = moment.utc(date_obj);
        const date_str   = moment_obj.format('YYYY-MM-DD');
        const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
        const payout     = parseFloat(statement.payout);
        const amount     = parseFloat(statement.amount);
        const balance    = parseFloat(statement.balance_after);
        const is_ico_bid = /binaryico/i.test(statement.shortcode); // TODO: remove ico exception when all ico contracts are removed

        // action_type may be (buy|sell|deposit|withdrawal) from API
        let localized_action = localize(toTitleCase(statement.action_type) /* localize-ignore */);
        if (is_ico_bid) {
            localized_action = /buy/i.test(statement.action_type) ? localize('Bid') : localize('Closed Bid');
        }

        return {
            localized_action,
            action_type: statement.action_type,
            date       : `${date_str}\n${time_str}`,
            ref        : statement.transaction_id,
            payout     : isNaN(payout) || is_ico_bid || !+payout ? '-' : formatMoney(currency, payout, true),
            amount     : isNaN(amount) ? '-' : formatMoney(currency, amount, true),
            balance    : isNaN(balance) ? '-' : formatMoney(currency, balance, true),
            desc       : localize(statement.longcode.replace(/\n/g, '<br />') /* localize-ignore */), // untranslated desc
            id         : statement.contract_id,
            app_id     : statement.app_id,
        };
    };

    const generateCSV = (all_data) => {
        const columns  = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'];
        const header   = localize(['Date', 'Reference ID', 'Potential Payout', 'Action', 'Description', 'Credit/Debit']);
        const currency = Client.get('currency');
        header.push(localize('Balance') + (currency ? ` (${currency})` : ''));
        const sep = ',';
        let csv   = [header.join(sep)];
        if (all_data && all_data.length > 0) {
            // eslint-disable-next-line no-control-regex
            csv = csv.concat(all_data.map(data => columns.map(key => (data[key] ? data[key].replace(formatCurrency(currency), '¥').replace(new RegExp(sep, 'g'), '').replace(new RegExp('\n|<br />', 'g'), ' ') : '')).join(sep)));
        }
        return csv.join('\r\n');
    };

    return {
        getStatementData,
        generateCSV,
    };
})();

module.exports = Statement;
