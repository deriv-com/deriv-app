import * as Cookies           from 'js-cookie';
import {
    action,
    computed }                from 'mobx';
import { getLanguage }        from 'deriv-translations';
import BinarySocket           from '_common/base/socket_base';
import { isLoginPages }       from '_common/base/login';
import {
    toMoment,
    epochToMoment }           from 'Utils/Date';
import BaseStore              from './base-store';
import { getMT5AccountType }  from './Helpers/client';
import { getAppId }           from '../config';

export default class GTMStore extends BaseStore {
    is_gtm_applicable = /^(16303|16929)$/.test(getAppId());

    constructor(root_store) {
        super({ root_store });

        this.onSwitchAccount(this.accountSwitcherListener);
    }

    @computed
    get visitorId() {
        return this.root_store.client.loginid;
    }

    /**
     * Contains common data that will be passed to GTM on each datalayer push
     *
     * @returns {object}
     */
    @computed
    get common_variables() {
        return {
            language: getLanguage(),
            ...this.root_store.client.is_logged_in && {
                visitorId: this.visitorId,
                currency : this.root_store.client.currency,
                userId   : this.root_store.client.user_id,
            },
            ...this.root_store.ui.is_dark_mode_on && {
                theme: this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
            },
        };
    }

    @action.bound
    accountSwitcherListener() {
        return new Promise(async (resolve) => resolve(this.pushDataLayer({ event: 'account switch' })));
    }

    /**
     * Pushes provided data as GTM DataLayer
     *
     * @param {object} data
     */
    @action.bound
    async pushDataLayer(data) {
        if (this.is_gtm_applicable && !isLoginPages()) {
            BinarySocket.wait('authorize').then(() => {
                dataLayer.push({
                    ...this.common_variables,
                    ...data,
                });
            });
        }
    }

    /**
     * Pushes deposit & withdrawal data from transaction-stream to GTM
     *
     * @param {object} response
     * @param {object} extra_data
     */
    @action.bound
    pushTransactionData(response, extra_data = {}) {
        if (!this.is_gtm_applicable || this.root_store.client.is_virtual) return;
        if (!response.transaction || !response.transaction.action) return;
        if (!['deposit', 'withdrawal'].includes(response.transaction.action)) return;

        const moment_now  = toMoment();
        const storage_key = 'GTM_transactions';

        // Remove values from prev days so localStorage doesn't grow to infinity
        let gtm_transactions = JSON.parse(localStorage.getItem(storage_key)) || {};
        if (Object.prototype.hasOwnProperty.call(gtm_transactions, 'timestamp')) {
            if (moment_now.isAfter(epochToMoment(gtm_transactions.timestamp), 'day')) {
                localStorage.removeItem(storage_key);
                gtm_transactions = { timestamp: moment_now.unix() };
            }
        }
        const transactions_arr = gtm_transactions.transactions || [];
        if (!transactions_arr.includes(response.transaction.transaction_id)) {
            const data = {
                event           : 'transaction',
                bom_account_type: this.root_store.client.account_type,
                bom_today       : moment_now.unix(),
                transaction     : {
                    id    : response.transaction.transaction_id,
                    type  : response.transaction.action,
                    time  : response.transaction.transaction_time,
                    amount: response.transaction.amount,
                },
            };
            Object.assign(data, extra_data);
            this.pushDataLayer(data);

            transactions_arr.push(response.transaction.transaction_id);
            gtm_transactions.transactions = transactions_arr;
            gtm_transactions.timestamp    = gtm_transactions.timestamp || moment_now.unix();

            localStorage.setItem(storage_key, JSON.stringify(gtm_transactions));
        }
    }

    @action.bound
    eventHandler(get_settings) {
        if (!this.is_gtm_applicable) return;

        const login_event       = localStorage.getItem('GTM_login');
        const is_new_account    = localStorage.getItem('GTM_new_account') === '1';

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_new_account');

        const affiliate_token = Cookies.getJSON('affiliate_tracking');
        if (affiliate_token) {
            this.pushDataLayer({ affiliate_token: affiliate_token.t });
        }

        // Get current time (moment, set by server), else fallback to client time
        const moment_now = toMoment();
        const data = {
            visitorId     : this.visitorId,
            account_type  : this.root_store.client.account_type,
            currency      : this.root_store.client.currency,
            country       : get_settings.country,
            country_abbrev: get_settings.country_code,
            email         : get_settings.email,
            url           : window.location.href,
            today         : moment_now.unix(),
        };

        if (is_new_account) {
            data.event = 'new_account';
            data.bom_date_joined = data.bom_today;
        }

        if (login_event) {
            data.event = login_event;
            BinarySocket.wait('mt5_login_list').then((response) => {
                (response.mt5_login_list || []).forEach((obj) => {
                    const acc_type = (getMT5AccountType(obj.group) || '')
                        .replace('real_vanuatu', 'financial').replace('vanuatu_', '').replace(/svg/, 'gaming'); // i.e. financial_cent, demo_cent, demo_gaming, real_gaming
                    if (acc_type) {
                        data[`mt5_${acc_type}_id`] = obj.login;
                    }
                });
                this.pushDataLayer(data);
            });
        } else {
            this.pushDataLayer(data);
        }
    }

    @action.bound
    setLoginFlag(event_name) {
        if (this.is_gtm_applicable) {
            localStorage.setItem('GTM_login', event_name);
        }
    }
}
