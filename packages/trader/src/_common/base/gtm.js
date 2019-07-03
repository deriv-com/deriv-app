const Cookies          = require('js-cookie');
const moment           = require('moment');
const ClientBase       = require('./client_base');
const Login            = require('./login');
const ServerTime       = require('./server_time');
const BinarySocket     = require('./socket_base');
const getLanguage      = require('../language').get;
const LocalStore       = require('../storage').LocalStore;
const State            = require('../storage').State;
const getPropertyValue = require('../utility').getPropertyValue;
const getAppId         = require('../../config').getAppId;

const GTM = (() => {
    const isGtmApplicable = () => (/^(16303|16929)$/.test(getAppId()));

    const getCommonVariables = () => ({
        language: getLanguage(),
        ...ClientBase.isLoggedIn() && {
            visitorId: ClientBase.get('loginid'),
            currency : ClientBase.get('currency'),
        },
        ...('is_dark_mode_on' in LocalStore.getObject('ui_store')) && {
            theme: LocalStore.getObject('ui_store').is_dark_mode_on ? 'dark' : 'light',
        },
    });

    const pushDataLayer = (data) => {
        if (isGtmApplicable() && !Login.isLoginPages()) {
            dataLayer.push({
                ...getCommonVariables(),
                ...data,
            });
        }
    };

    const eventHandler = (get_settings) => {
        if (!isGtmApplicable()) return;
        const login_event       = localStorage.getItem('GTM_login');
        const is_new_account    = localStorage.getItem('GTM_new_account') === '1';

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_new_account');

        const affiliate_token = Cookies.getJSON('affiliate_tracking');
        if (affiliate_token) {
            pushDataLayer({ bom_affiliate_token: affiliate_token.t });
        }

        // Get current time (moment, set by server), else fallback to client time
        const moment_now = window.time || moment().utc();
        const data = {
            visitorId         : ClientBase.get('loginid'),
            bom_account_type  : ClientBase.getAccountType(),
            bom_currency      : ClientBase.get('currency'),
            bom_country       : get_settings.country,
            bom_country_abbrev: get_settings.country_code,
            bom_email         : get_settings.email,
            url               : window.location.href,
            bom_today         : moment_now.unix(),
        };

        if (is_new_account) {
            data.event = 'new_account';
            data.bom_date_joined = data.bom_today;
        }

        if (!ClientBase.get('is_virtual')) {
            data.bom_age       = moment_now.diff(moment.unix(get_settings.date_of_birth).utc(), 'year');
            data.bom_firstname = get_settings.first_name;
            data.bom_lastname  = get_settings.last_name;
            data.bom_phone     = get_settings.phone;
        }

        if (login_event) {
            data.event = login_event;
            BinarySocket.wait('mt5_login_list').then((response) => {
                (response.mt5_login_list || []).forEach((obj) => {
                    const acc_type = (ClientBase.getMT5AccountType(obj.group) || '')
                        .replace('real_vanuatu', 'financial').replace('vanuatu_', '').replace(/svg/, 'gaming'); // i.e. financial_cent, demo_cent, demo_gaming, real_gaming
                    if (acc_type) {
                        data[`mt5_${acc_type}_id`] = obj.login;
                    }
                });
                pushDataLayer(data);
            });
        } else {
            pushDataLayer(data);
        }

        // check if there are any transactions in the last 30 days for UX interview selection
        BinarySocket.send({ statement: 1, limit: 1 }).then((response) => {
            const last_transaction_timestamp = getPropertyValue(response, ['statement', 'transactions', '0', 'transaction_time']);
            pushDataLayer({
                bom_transaction_in_last_30d: !!last_transaction_timestamp && moment(last_transaction_timestamp * 1000).isAfter(ServerTime.get().subtract(30, 'days')),
            });
        });
    };

    const mt5NewAccount = (response) => {
        const acc_type = response.mt5_new_account.mt5_account_type ?
            `${response.mt5_new_account.account_type}_${response.mt5_new_account.mt5_account_type}` : // financial_cent, demo_cent, ...
            `${response.mt5_new_account.account_type === 'demo' ? 'demo' : 'real'}_gaming`;           // demo_gaming, real_gaming

        const gtm_data = {
            event          : 'mt5_new_account',
            bom_email      : ClientBase.get('email'),
            bom_country    : State.getResponse('get_settings.country'),
            mt5_last_signup: acc_type,
        };

        gtm_data[`mt5_${acc_type}_id`] = response.mt5_new_account.login;

        if (/demo/.test(acc_type) && !ClientBase.get('is_virtual')) {
            gtm_data.visitorId = ClientBase.getAccountOfType('virtual').loginid;
        }

        pushDataLayer(gtm_data);
    };

    // Pushes deposit & withdrawal data from transaction-stream to GTM
    const pushTransactionData = (response, extra_data = {}) => {
        if (!isGtmApplicable() || ClientBase.get('is_virtual')) return;
        if (!response.transaction || !response.transaction.action) return;
        if (!['deposit', 'withdrawal'].includes(response.transaction.action)) return;

        const moment_now  = window.time || moment().utc();
        const storage_key = 'GTM_transactions';

        // Remove values from prev days so localStorage doesn't grow to infinity
        let gtm_transactions = JSON.parse(localStorage.getItem(storage_key)) || {};
        if (Object.prototype.hasOwnProperty.call(gtm_transactions, 'timestamp')) {
            if (moment_now.isAfter(moment.unix(gtm_transactions.timestamp).utc(), 'day')) {
                localStorage.removeItem(storage_key);
                gtm_transactions = { timestamp: moment_now.unix() };
            }
        }
        const transactions_arr = gtm_transactions.transactions || [];
        if (!transactions_arr.includes(response.transaction.transaction_id)) {
            const data = {
                event           : 'transaction',
                bom_account_type: ClientBase.getAccountType(),
                bom_today       : moment_now.unix(),
                transaction     : {
                    id     : response.transaction.transaction_id,
                    type   : response.transaction.action,
                    time   : response.transaction.transaction_time,
                    amount : response.transaction.amount,
                    balance: response.transaction.balance,
                },
            };
            Object.assign(data, extra_data);
            pushDataLayer(data);

            transactions_arr.push(response.transaction.transaction_id);
            gtm_transactions.transactions = transactions_arr;
            gtm_transactions.timestamp    = gtm_transactions.timestamp || moment_now.unix();

            localStorage.setItem(storage_key, JSON.stringify(gtm_transactions));
        }
    };

    return {
        pushDataLayer,
        eventHandler,
        pushTransactionData,
        mt5NewAccount,
    };
})();

module.exports = GTM;
