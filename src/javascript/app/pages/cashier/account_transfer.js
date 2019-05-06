const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const BinarySocket       = require('../../base/socket');
const Currency           = require('../../common/currency');
const FormManager        = require('../../common/form_manager');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const localize           = require('../../../_common/localize').localize;
const State              = require('../../../_common/storage').State;
const getPropertyValue   = require('../../../_common/utility').getPropertyValue;

const AccountTransfer = (() => {
    const form_id       = 'frm_account_transfer';
    const form_id_hash  = `#${form_id}`;

    const messages = {
        parent : 'client_message',
        error  : 'no_account',
        balance: 'not_enough_balance',
        deposit: 'no_balance',
        limit  : 'limit_reached',
    };

    let el_transfer_from,
        el_transfer_to,
        el_reset_transfer,
        el_transfer_fee,
        el_fee_amount,
        el_fee_minimum,
        el_success_form,
        client_balance,
        client_currency,
        client_loginid,
        withdrawal_limit,
        max_amount,
        transferable_amount,
        to_loginid,
        transfer_to_currency;

    /**
     * Sort Accounts
     * See : https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_sortby-and-_orderby
     * @param accounts
     * @returns {*}
     */
    const sortAccounts = (accounts) => {
        const sortBy = (key) => (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);

        return accounts.concat().sort(sortBy('currency'));
    };

    const populateAccounts = (accounts) => {
        client_loginid   = Client.get('loginid');
        el_transfer_from = getElementById('lbl_transfer_from');
        el_transfer_to   = getElementById('transfer_to');

        elementTextContent(el_transfer_from, `${client_loginid} ${client_currency ? `(${client_currency})` : ''}`);

        const fragment_transfer_to = document.createElement('select');

        sortAccounts(accounts).forEach((account, index) => {
            if (Client.canTransferFunds(account)) {
                if (index === 0) {
                    to_loginid = account.loginid;
                }
                const option = document.createElement('option');
                option.setAttribute('data-currency', account.currency);
                option.setAttribute('data-loginid', account.loginid);
                option.appendChild(document.createTextNode(`${account.loginid}${account.currency ? ` (${account.currency})` : ''}`));
                fragment_transfer_to.appendChild(option);
            }
        });

        if (!fragment_transfer_to.childElementCount) {
            showError();
            return;
        } else if (fragment_transfer_to.childElementCount === 1) {
            const el_label_transfer_to = document.createElement('p');
            el_label_transfer_to.setAttribute('data-value', fragment_transfer_to.firstChild.textContent);
            el_label_transfer_to.setAttribute('id', el_transfer_to.getAttribute('id'));
            el_label_transfer_to.innerText = fragment_transfer_to.firstChild.textContent;
            to_loginid = fragment_transfer_to.firstChild.getAttribute('data-loginid');
            el_transfer_to.setVisibility(0);
            el_transfer_to.setAttribute('data-value', fragment_transfer_to.firstChild.textContent);
            el_transfer_to.setAttribute('data-loginid', to_loginid);
            el_transfer_to.parentElement.insertBefore(el_label_transfer_to, el_transfer_to);
        } else {
            el_transfer_to.innerHTML = fragment_transfer_to.innerHTML;
        }
        el_transfer_to.addEventListener('change', (e) => {
            setTransferFeeAmount();
            to_loginid = e.target.getAttribute('data-loginid');
        });

        transfer_to_currency = getElementById('amount-add-on');
        transfer_to_currency.textContent = Client.get('currency');

        if (Client.hasCurrencyType('crypto') && Client.hasCurrencyType('fiat')) {
            setTransferFeeAmount();
            elementTextContent(el_fee_minimum, Currency.getMinimumTransferFee(client_currency));
            el_transfer_fee.setVisibility(1);
        } else {
            const to_currency = el_transfer_to.getAttribute('data-currency');
            el_transfer_fee.setVisibility(client_currency !== to_currency);
        }

        // Hide Notes from MF|MLT accounts
        if (/iom|malta/.test(Client.get('landing_company_shortcode'))) {
            el_transfer_fee.setVisibility(0);
        }
    };

    const setTransferFeeAmount = () => {
        elementTextContent(el_fee_amount, Currency.getTransferFee(client_currency, (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').match(/\((\w+)\)/)[1]));
    };

    const hasError = (response) => {
        const error = response.error;
        if (error) {
            const el_error = getElementById('error_message').getElementsByTagName('p')[0];
            elementTextContent(el_error, error.message);
            if (el_error.parentNode) {
                el_error.parentNode.setVisibility(1);
            }
            return true;
        }
        return false;
    };

    const showError = () => {
        getElementById(messages.parent).setVisibility(1);
        getElementById(messages.error).setVisibility(1);
    };

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', decimals: Currency.getDecimalPlaces(client_currency), min: Currency.getTransferLimits(client_currency, 'min'), max: transferable_amount, format_money: true }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: client_loginid },
            { request_field: 'account_to',                value: () => (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').split(' (')[0] },
            { request_field: 'currency',                  value: client_currency },
        ]);

        FormManager.handleSubmit({
            form_selector       : form_id_hash,
            fnc_response_handler: responseHandler,
            enable_button       : true,
        });
    };

    const responseHandler = (response) => {
        if (response.error) {
            const el_error = getElementById('form_error');
            elementTextContent(el_error, response.error.message);
            el_error.setVisibility(1);
            // Auto hide error after 5 seconds.
            setTimeout(() => el_error.setVisibility(0), 5000);
        } else {
            BinarySocket.send({ transfer_between_accounts: 1 }).then(data => populateReceipt(response, data));
        }
    };

    const populateReceipt = (response_submit_success, response) => {
        getElementById(form_id).setVisibility(0);
        response.accounts.forEach((account) => {
            if (account.loginid === client_loginid) {
                elementTextContent(getElementById('transfer_success_from'), localize('From account: '));
                elementTextContent(getElementById('from_loginid'), `${account.loginid} (${account.currency})`);
                getElementById('from_current_balance').innerText = Currency.getTextFormat(account.balance, account.currency);
            } else if (account.loginid === response_submit_success.client_to_loginid) {
                elementTextContent(getElementById('transfer_success_to'), localize('To account: '));
                elementTextContent(getElementById('to_loginid'), `${account.loginid} (${account.currency})`);
                getElementById('to_current_balance').innerText = Currency.getTextFormat(account.balance, account.currency);
            }
        });

        el_transfer_fee.setVisibility(0);
        el_success_form.setVisibility(1);
    };

    const onClickReset = () => {
        el_success_form.setVisibility(0);
        getElementById('amount').value = '';
        onLoad();
    };

    const onLoad = () => {
        if (!Client.canTransferFunds()) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        el_transfer_fee   = getElementById('transfer_fee');
        el_fee_amount     = getElementById('transfer_fee_amount');
        el_fee_minimum    = getElementById('transfer_fee_minimum');
        el_success_form   = getElementById('success_form');
        el_reset_transfer = getElementById('reset_transfer');
        el_reset_transfer.addEventListener('click', onClickReset);

        BinarySocket.wait('balance').then((response) => {
            client_balance   = +getPropertyValue(response, ['balance', 'balance']);
            client_currency  = Client.get('currency');
            const min_amount = Currency.getTransferLimits(client_currency, 'min');
            if (!client_balance || client_balance < +min_amount) {
                getElementById(messages.parent).setVisibility(1);
                if (client_currency) {
                    elementTextContent(getElementById('min_required_amount'), `${client_currency} ${min_amount}`);
                    getElementById(messages.balance).setVisibility(1);
                }
                getElementById(messages.deposit).setVisibility(1);
            } else {
                const req_transfer_between_accounts = BinarySocket.send({ transfer_between_accounts: 1 });
                const req_get_limits                = BinarySocket.send({ get_limits: 1 });
                const get_account_status            = BinarySocket.send({ get_account_status: 1 });

                Promise.all([req_transfer_between_accounts, req_get_limits, get_account_status]).then(() => {
                    const response_transfer = State.get(['response', 'transfer_between_accounts']);
                    const response_limits   = State.get(['response', 'get_limits']);
                    const is_authenticated  = State.getResponse('get_account_status.status').some(state => state === 'authenticated');

                    if (hasError(response_transfer)) {
                        return;
                    }
                    const accounts = response_transfer.accounts;
                    if (!accounts || !accounts.length) {
                        showError();
                        return;
                    }
                    if (hasError(response_limits)) {
                        return;
                    }

                    populateAccounts(accounts);
                    setLimits(response_limits, min_amount, is_authenticated).then(() => {
                        showForm({ is_authenticated });
                        populateHints();
                    }).catch(() => {
                        getElementById(messages.limit).setVisibility(1);
                        getElementById(messages.parent).setVisibility(1);
                        el_transfer_fee.setVisibility(0);
                    });

                });
            }
        });
    };

    const setLimits = (response, min_amount, is_authenticated) => new Promise((resolve, reject) => {
        withdrawal_limit = +response.get_limits.remainder;
        if (withdrawal_limit < +min_amount) {
            reject(new Error('Withdrawal limit is less than Min amount.'));
        }

        max_amount = Currency.getTransferLimits(Client.get('currency'), 'max');

        const from_currency = Client.get('currency');
        const to_currency   = Client.get('currency', to_loginid);
        if (!Currency.isCryptocurrency(from_currency) && !Currency.isCryptocurrency(to_currency) && is_authenticated) {
            transferable_amount = client_balance;
        } else {
            transferable_amount = max_amount ? Math.min(max_amount, withdrawal_limit, client_balance) : Math.min(
                withdrawal_limit,
                client_balance,
            );
        }

        getElementById('range_hint_min').textContent = min_amount;
        resolve();
    });

    const populateHints = () => {
        getElementById('limit_current_balance').innerText  = Currency.getTextFormat(client_balance, client_currency);

        getElementById('limit_max_amount').innerText = max_amount ? Currency.getTextFormat(transferable_amount, client_currency) : localize('Not announced for this currency.');

        $('#range_hint').accordion({
            heightStyle: 'content',
            collapsible: true,
            active     : true,
        });

        getElementById('range_hint').show();
    };

    const onUnload = () => {
        if (el_reset_transfer) el_reset_transfer.removeEventListener('click', onClickReset);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = AccountTransfer;
