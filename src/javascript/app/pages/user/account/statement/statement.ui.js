const Statement   = require('./statement');
const Client      = require('../../../../base/client');
const Table       = require('../../../../common/attach_dom/table');
const formatMoney = require('../../../../common/currency').formatMoney;
const showTooltip = require('../../../../common/get_app_details').showTooltip;
const localize    = require('../../../../../_common/localize').localize;
const downloadCSV = require('../../../../../_common/utility').downloadCSV;

const StatementUI = (() => {
    let all_data   = [];
    let oauth_apps = {};

    const table_id = 'statement-table';
    const columns  = ['date', 'ref', 'payout', 'act', 'desc', 'credit', 'bal', 'details'];

    const createEmptyStatementTable = () => {
        const header = [
            localize('Date'),
            localize('Ref.'),
            localize('Potential Payout'),
            localize('Action'),
            localize('Description'),
            localize('Credit/Debit'),
            localize('Balance'),
            localize('Details'),
        ];

        const currency = Client.get('currency');

        header[6] += currency ? ` (${currency})` : '';

        const metadata = {
            id  : table_id,
            cols: columns,
        };
        const data = [];
        return Table.createFlexTable(data, metadata, header);
    };

    const clearTableContent = () => {
        Table.clearTableBody(table_id);
        all_data = [];
        $(`#${table_id} > tfoot`).hide();
    };

    const createStatementRow = (transaction) => {
        const statement_data = Statement.getStatementData(transaction, Client.get('currency'));
        all_data.push($.extend({}, statement_data, {
            action: statement_data.localized_action,
            desc  : statement_data.desc,
        }));
        const credit_debit_type = (parseFloat(transaction.amount) >= 0) ? 'profit' : 'loss';

        const $statement_row = Table.createFlexTableRow([
            statement_data.date,
            `<span ${showTooltip(statement_data.app_id, oauth_apps[statement_data.app_id])}>${statement_data.ref}</span>`,
            statement_data.payout,
            statement_data.localized_action,
            '',
            statement_data.amount,
            statement_data.balance,
            '',
        ], columns, 'data');
        $statement_row.children('.credit').addClass(credit_debit_type);
        $statement_row.children('.date').addClass('pre');
        $statement_row.children('.desc').html(`${statement_data.desc}<br>`);

        // create view button and append
        if (/^(buy|sell)$/i.test(statement_data.action_type)) {
            const $view_button = $('<button/>', { class: 'button open_contract_details', text: localize('View'), contract_id: statement_data.id });
            $statement_row.children('.desc,.details').append($view_button);
        }

        return $statement_row[0];        // return DOM instead of jquery object
    };

    const updateStatementTable = (transactions) => {
        Table.appendTableBody(table_id, transactions, createStatementRow);
    };

    const errorMessage = (msg) => {
        const $err = $('#statement-container').find('#error-msg');
        if (msg) {
            $err.setVisibility(1).text(msg);
        } else {
            $err.setVisibility(0).text('');
        }
    };

    const exportCSV = () => {
        downloadCSV(
            Statement.generateCSV(all_data),
            `Statement_${Client.get('loginid')}_latest${$('#rows_count').text()}_${window.time.replace(/\s/g, '_').replace(/:/g, '')}.csv`);
    };

    const updateAccountStatistics = (account_statistics) => {
        const { currency, total_deposits, total_withdrawals } = account_statistics;

        $('#total_deposits').html(formatMoney(currency, total_deposits));
        $('#total_withdrawals').html(formatMoney(currency, total_withdrawals));
        $('#net_deposits').html(formatMoney(currency, +total_deposits - +total_withdrawals));
        $('#account_statistics').setVisibility(1);
    };

    return {
        clearTableContent,
        createEmptyStatementTable,
        updateStatementTable,
        errorMessage,
        exportCSV,
        updateAccountStatistics,

        setOauthApps: values => (oauth_apps = values),
    };
})();

module.exports = StatementUI;
