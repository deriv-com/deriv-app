import {
    action,
    computed,
    observable,
    when }                           from 'mobx';
import moment                        from 'moment';
import {
    requestLogout,
    WS }                             from 'Services';
import { getAccountTitle }           from '_common/base/client_base';
import BinarySocket                  from '_common/base/socket_base';
import * as SocketCache              from '_common/base/socket_cache';
import { localize }                  from '_common/localize';
import {
    LocalStore,
    State }                          from '_common/storage';
import BaseStore                     from './base-store';
import { buildCurrenciesList }       from './Modules/Trading/Helpers/currency';
import { handleClientNotifications } from './Helpers/client-notifications';

const storage_key = 'client.accounts';
export default class ClientStore extends BaseStore {
    @observable loginid;
    @observable upgrade_info;
    @observable accounts;
    @observable switched         = '';
    @observable switch_broadcast = false;
    @observable currencies_list  = {};
    @observable selected_currency = '';

    constructor(root_store) {
        super({ root_store });
    }

    @computed
    get balance() {
        if (!this.accounts) return '';
        return (this.accounts[this.loginid] && this.accounts[this.loginid].balance) ?
            this.accounts[this.loginid].balance.toString() :
            '';
    }

    /**
     * Temporary property. should be removed once we are fully migrated from the old app.
     *
     * @returns {boolean}
     */
    @computed
    get is_client_allowed_to_visit() {
        return !!(
            !this.is_logged_in || this.is_virtual || this.accounts[this.loginid].landing_company_shortcode === 'svg'
        );
    }

    @computed
    get account_list() {
        return this.all_loginids.map(id => (
            !this.isDisabled(id) &&
            this.getToken(id) ?
                this.getAccountInfo(id) :
                undefined
        )).filter(account => account);
    }

    @computed
    get active_accounts() {
        return this.accounts instanceof Object
            ? Object.values(this.accounts).filter(account => !account.is_disabled)
            : [];
    }

    @computed
    get all_loginids() {
        return this.accounts instanceof Object ? Object.keys(this.accounts) : [];
    }

    @computed
    get account_title() {
        return getAccountTitle(this.loginid);
    }

    @computed
    get currency() {
        if (this.selected_currency.length) {
            return this.selected_currency;
        } else if (this.is_logged_in) {
            return this.accounts[this.loginid].currency;
        }
        return this.default_currency;

    }

    @computed
    get default_currency() {
        if (Object.keys(this.currencies_list).length > 0) {
            const keys = Object.keys(this.currencies_list);
            return Object.values(this.currencies_list[`${keys[0]}`])[0].text;
        } return 'USD';
    }

    @computed
    get is_valid_login() {
        if (!this.is_logged_in) return true;
        const valid_login_ids_regex = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return this.all_loginids.every(id => valid_login_ids_regex.test(id));
    }

    @computed
    get is_logged_in() {
        return !!(
            this.accounts instanceof Object &&
            Object.keys(this.accounts).length > 0 &&
            this.loginid &&
            this.accounts[this.loginid].token
        );
    }

    @computed
    get is_virtual() {
        return this.accounts[this.loginid] && !!this.accounts[this.loginid].is_virtual;
    }

    @computed
    get can_upgrade() {
        return this.upgrade_info && (this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi);
    }

    @computed
    get can_upgrade_to() {
        return this.upgrade_info && (this.upgrade_info.can_upgrade_to);
    }

    @computed
    get virtual_account_loginid() {
        return this.all_loginids
            .find(loginid => !!this.accounts[loginid].is_virtual);
    }

    @computed
    get is_single_currency() {
        return Object.keys(this.currencies_list).map(type => Object.values(this.currencies_list[type]).length)
            .reduce((acc, cur) => acc + cur, 0) === 1;
    }

    /**
     * Store Values relevant to the loginid to local storage.
     *
     * @param loginid
     */
    @action.bound
    resetLocalStorageValues(loginid) {
        this.accounts[loginid].cashier_confirmed = 0;
        this.accounts[loginid].accepted_bch      = 0;
        LocalStore.setObject(storage_key, this.accounts);
        LocalStore.set('active_loginid', loginid);
        this.loginid = loginid;
    }

    @action.bound
    getBasicUpgradeInfo() {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');
        let can_open_multi                  = false;
        let type,
            can_upgrade_to;
        if ((upgradeable_landing_companies || []).length) {
            can_open_multi   = upgradeable_landing_companies.indexOf(
                this.accounts[this.loginid].landing_company_shortcode) !== -1;
            const canUpgrade = (...landing_companies) => landing_companies.find(landing_company => (
                landing_company !== this.accounts[this.loginid].landing_company_shortcode &&
                upgradeable_landing_companies.indexOf(landing_company) !== -1
            ));
            can_upgrade_to   = canUpgrade('svg', 'iom', 'malta', 'maltainvest');
            if (can_upgrade_to) {
                type = can_upgrade_to === 'maltainvest' ? 'financial' : 'real';
            }
        }

        return {
            type,
            can_upgrade: !!can_upgrade_to,
            can_upgrade_to,
            can_open_multi,
        };
    }

    @action.bound
    responsePayoutCurrencies(response) {
        const list = response.payout_currencies || response;
        this.currencies_list = buildCurrenciesList(list);
        this.selectCurrency('');
    }

    @action.bound
    responseAuthorize(response) {
        this.accounts[this.loginid].email                     = response.authorize.email;
        this.accounts[this.loginid].currency                  = response.authorize.currency;
        this.accounts[this.loginid].is_virtual                = +response.authorize.is_virtual;
        this.accounts[this.loginid].session_start             = parseInt(moment().utc().valueOf() / 1000);
        this.accounts[this.loginid].landing_company_shortcode = response.authorize.landing_company_name;
        this.updateAccountList(response.authorize.account_list);
        this.upgrade_info = this.getBasicUpgradeInfo();
        this.user_id      = response.authorize.user_id;
    }

    @action.bound
    updateAccountList(account_list) {
        account_list.forEach((account) => {
            if (this.accounts[account.loginid]) {
                this.accounts[account.loginid].excluded_until = account.excluded_until || '';
                Object.keys(account).forEach((param) => {
                    const param_to_set = param === 'country' ? 'residence' : param;
                    const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                    if (param_to_set !== 'loginid') {
                        this.accounts[account.loginid][param_to_set] = value_to_set;
                    }
                });
            }
        });
    }

    /**
     * Switch to the given loginid account.
     *
     * @param {string} loginid
     */
    @action.bound
    switchAccount(loginid) {
        this.root_store.ui.removeAllNotifications();
        this.switched = loginid;
    }

    @action.bound
    switchEndSignal() {
        this.switch_broadcast = false;
        this.root_store.ui.is_app_blurred = false;
    }

    /**
     * We initially fetch things from local storage, and then do everything inside the store.
     * This will probably be the only place we are fetching data from Client_base.
     */
    @action.bound
    async init() {
        this.loginid  = LocalStore.get('active_loginid');
        this.accounts = LocalStore.getObject(storage_key);
        this.switched = '';

        const client = this.accounts[this.loginid];
        if (client && !client.is_virtual) {
            BinarySocket.wait('landing_company', 'website_status').then(() => {
                handleClientNotifications(client, this.root_store.ui.addNotification, this.loginid);
            });
        }

        this.selectCurrency('');

        this.responsePayoutCurrencies(await WS.payoutCurrencies());

        this.registerReactions();
    }

    /**
     * Check if account is disabled or not
     *
     * @param loginid
     * @returns {string}
     */
    isDisabled(loginid = this.loginid) {
        return this.getAccount(loginid).is_disabled;
    }

    /**
     * Get accounts token from given login id.
     *
     * @param loginid
     * @returns {string}
     */
    getToken(loginid = this.loginid) {
        return this.getAccount(loginid).token;
    }

    /**
     * Get account object from given login id
     *
     * @param loginid
     * @returns {object}
     */
    getAccount(loginid = this.loginid) {
        return this.accounts[loginid];
    }

    /**
     * Get information required by account switcher
     *
     * @param loginid
     * @returns {{loginid: *, is_virtual: (number|number|*), icon: string, title: *}}
     */
    getAccountInfo(loginid = this.loginid) {
        const account      = this.getAccount(loginid);
        const currency     = account.currency;
        const is_virtual   = account.is_virtual;
        const account_type = !is_virtual && currency ? currency : getAccountTitle(loginid);

        return {
            loginid,
            is_virtual,
            icon : account_type.toLowerCase(), // TODO: display the icon
            title: account_type.toLowerCase() === 'virtual' ? localize('DEMO') : account_type,
        };
    }

    @action.bound
    broadcastAccountChange() {
        this.switch_broadcast = true;
    }

    @action.bound
    async switchAccountHandler () {
        if (!this.switched || !this.switched.length || !this.getAccount(this.switched).token) {
            // Logout if the switched_account doesn't belong to any loginid.
            if (!this.all_loginids.some(id => id !== this.switched) || this.switched === this.loginid) {
                this.root_store.ui.addNotification({
                    message: localize('Could not switch to default account.'),
                    type   : 'danger',
                });
                // request a logout
                requestLogout();
                return;
            }

            this.root_store.modules.portfolio.clearTable();
            // Send a toast message to let the user know we can't switch his account.
            this.root_store.ui.addNotification({
                message: localize('Switching to default account.'),
                type   : 'info',
            });

            // switch to default account.
            this.switchAccount(this.all_loginids[0]);
            await this.switchAccountHandler();
            return;
        }
        sessionStorage.setItem('active_tab', '1');
        // set local storage
        this.root_store.gtm.setLoginFlag();
        this.resetLocalStorageValues(this.switched);
        SocketCache.clear();
        await BinarySocket.send({ 'authorize': this.getToken() }, { forced: true });
        await this.init();
        this.broadcastAccountChange();
    }

    @action.bound
    registerReactions() {
        // Switch account reactions.
        when(
            () => this.switched,
            this.switchAccountHandler
        );
    }

    @action.bound
    setBalance(balance) {
        this.accounts[this.loginid].balance = balance;
    }

    @action.bound
    selectCurrency(value) {
        this.selected_currency = value;
    }

    @action.bound
    setResidence(residence) {
        this.accounts[this.loginid].residence = residence;
    }

    @action.bound
    setEmail(email) {
        this.accounts[this.loginid].email = email;
    }

    @action.bound
    cleanUp() {
        this.root_store.gtm.pushDataLayer({ event: 'log_out' });
        this.loginid = null;
        this.upgrade_info = undefined;
        this.accounts = [];
        this.currencies_list  = {};
        this.selected_currency = '';
        this.root_store.modules.smart_chart.should_refresh_active_symbols = true;
        this.root_store.ui.removeAllNotifications();
        this.root_store.modules.trade.onMount();
    }

}
