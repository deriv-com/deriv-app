const CurrencyUtils = require('deriv-shared/utils/currency');
const ObjectUtils   = require('deriv-shared/utils/object');
const { localize }  = require('deriv-translations');
const SocketCache   = require('./socket_cache');
const LocalStore    = require('../storage').LocalStore;
const State         = require('../storage').State;

const ClientBase = (() => {
    const storage_key = 'client.accounts';
    let client_object = {};
    let current_loginid;

    const init = () => {
        current_loginid = LocalStore.get('active_loginid');
        client_object   = getAllAccountsObject();
    };

    const isLoggedIn = () => (
        !ObjectUtils.isEmptyObject(getAllAccountsObject()) &&
        get('loginid') &&
        get('token')
    );

    const isValidLoginid = () => {
        if (!isLoggedIn()) return true;
        const valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return getAllLoginids().every(loginid => valid_login_ids.test(loginid));
    };

    /**
     * Stores the client information in local variable and localStorage
     *
     * @param {String} key                 The property name to set
     * @param {String|Number|Object} value The regarding value
     * @param {String|null} loginid        The account to set the value for
     */
    const set = (key, value, loginid = current_loginid) => {
        if (key === 'loginid' && value !== current_loginid) {
            LocalStore.set('active_loginid', value);
            current_loginid = value;
        } else {
            if (!(loginid in client_object)) {
                client_object[loginid] = {};
            }
            client_object[loginid][key] = value;
            LocalStore.setObject(storage_key, client_object);
        }
    };

    /**
     * Returns the client information
     *
     * @param {String|null} key     The property name to return the value from, if missing returns the account object
     * @param {String|null} loginid The account to return the value from
     */
    const get = (key, loginid = current_loginid) => {
        let value;
        if (key === 'loginid') {
            value = loginid || LocalStore.get('active_loginid');
        } else {
            const current_client = client_object[loginid] || getAllAccountsObject()[loginid] || client_object;

            value = key ? current_client[key] : current_client;
        }
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    };

    const getAllAccountsObject = () => LocalStore.getObject(storage_key);

    const getAllLoginids = () => Object.keys(getAllAccountsObject());

    const getAccountType = (loginid = current_loginid) => {
        let account_type;
        if (/^VR/.test(loginid))          account_type = 'virtual';
        else if (/^MF/.test(loginid))     account_type = 'financial';
        else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    };

    const isAccountOfType = (type, loginid = current_loginid, only_enabled = false) => {
        const this_type   = getAccountType(loginid);
        return ((
            (type === 'virtual' && this_type === 'virtual') ||
            (type === 'real'    && this_type !== 'virtual') ||
            type === this_type) &&
            (only_enabled ? !get('is_disabled', loginid) : true));
    };

    const getAccountOfType = (type, only_enabled) => {
        const id = getAllLoginids().find(loginid => isAccountOfType(type, loginid, only_enabled));
        return id ? Object.assign({ loginid: id }, get(null, id)) : {};
    };

    const hasAccountType = (type, only_enabled) => !ObjectUtils.isEmptyObject(getAccountOfType(type, only_enabled));

    // only considers currency of real money accounts
    // @param {String} type = crypto|fiat
    const hasCurrencyType = (type) => {
        const loginids = getAllLoginids();
        if (type === 'crypto') {
            // find if has crypto currency account
            return loginids.find(loginid =>
                !get('is_virtual', loginid) && CurrencyUtils.isCryptocurrency(get('currency', loginid)));
        }
        // else find if have fiat currency account
        return loginids.find(loginid =>
            !get('is_virtual', loginid) && !CurrencyUtils.isCryptocurrency(get('currency', loginid)));
    };

    const TypesMapConfig = (() => {
        let types_map_config;

        const initTypesMap = () => ({
            default  : localize('Real'),
            financial: localize('Investment'),
            gaming   : localize('Gaming'),
            virtual  : localize('Virtual'),
        });

        return {
            get: () => {
                if (!types_map_config) {
                    types_map_config = initTypesMap();
                }
                return types_map_config;
            },
        };
    })();

    const getAccountTitle = loginid => {
        const types_map = TypesMapConfig.get();
        return (types_map[getAccountType(loginid)] || types_map.default);
    };

    const responseAuthorize = (response) => {
        const authorize = response.authorize;
        set('loginid', authorize.loginid);
    };

    const shouldAcceptTnc = (account_settings = State.getResponse('get_settings')) => {
        if (get('is_virtual')) return false;
        const website_tnc_version = State.getResponse('website_status.terms_conditions_version');
        const client_tnc_status   = account_settings.client_tnc_status;
        return typeof client_tnc_status !== 'undefined' && client_tnc_status !== website_tnc_version;
    };

    const clearAllAccounts = () => {
        current_loginid = undefined;
        client_object   = {};
        LocalStore.setObject(storage_key, client_object);
    };

    const setNewAccount = (options) => {
        if (!options.email || !options.loginid || !options.token) {
            return false;
        }

        SocketCache.clear();
        localStorage.setItem('GTM_new_account', '1');

        set('token',      options.token,       options.loginid);
        set('email',      options.email,       options.loginid);
        set('is_virtual', +options.is_virtual, options.loginid);
        set('loginid',    options.loginid);

        return true;
    };

    const currentLandingCompany = () => {
        const landing_company_response = State.getResponse('landing_company') || {};
        const this_shortcode           = get('landing_company_shortcode');
        const landing_company_prop     = Object.keys(landing_company_response).find((key) => (
            this_shortcode === landing_company_response[key].shortcode
        ));
        return landing_company_response[landing_company_prop] || {};
    };

    const shouldCompleteTax = (account_status = State.getResponse('get_account_status')) => isAccountOfType('financial') &&
        !/crs_tin_information/.test((account_status || {}).status);

    // remove manager id or master distinction from group
    // remove EUR or GBP distinction from group
    const getMT5AccountType = group => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');

    const getBasicUpgradeInfo = () => {
        const upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');

        let can_open_multi = false;
        let type,
            can_upgrade_to;
        if ((upgradeable_landing_companies || []).length) {
            const current_landing_company = get('landing_company_shortcode');

            can_open_multi = upgradeable_landing_companies.indexOf(current_landing_company) !== -1;

            // only show upgrade message to landing companies other than current
            const canUpgrade = (...landing_companies) => landing_companies.find(landing_company => (
                landing_company !== current_landing_company &&
                upgradeable_landing_companies.indexOf(landing_company) !== -1
            ));

            can_upgrade_to = canUpgrade('svg', 'iom', 'malta', 'maltainvest');
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
    };

    const getLandingCompanyValue = (loginid, landing_company, key) => {
        let landing_company_object;
        if (loginid.financial || isAccountOfType('financial', loginid)) {
            landing_company_object = ObjectUtils.getPropertyValue(landing_company, 'financial_company');
        } else if (loginid.real || isAccountOfType('real', loginid)) {
            landing_company_object = ObjectUtils.getPropertyValue(landing_company, 'gaming_company');

            // handle accounts that don't have gaming company
            if (!landing_company_object) {
                landing_company_object = ObjectUtils.getPropertyValue(landing_company, 'financial_company');
            }
        } else {
            const financial_company = (ObjectUtils.getPropertyValue(landing_company, 'financial_company') || {})[key] || [];
            const gaming_company    = (ObjectUtils.getPropertyValue(landing_company, 'gaming_company') || {})[key] || [];
            landing_company_object  = financial_company.concat(gaming_company);
            return landing_company_object;
        }
        return (landing_company_object || {})[key];
    };

    const getRiskAssessment = (account_status = State.getResponse('get_account_status')) => {
        const status       = account_status.status;
        const is_high_risk = /high/.test(account_status.risk_classification);

        return (
            isAccountOfType('financial') ?
                /(financial_assessment|trading_experience)_not_complete/.test(status) :
                (is_high_risk && /financial_assessment_not_complete/.test(status))
        );
    };

    // API_V3: send a list of accounts the client can transfer to
    const canTransferFunds = (account) => {
        if (account) {
            // this specific account can be used to transfer funds to
            return canTransferFundsTo(account.loginid);
        }
        // at least one account can be used to transfer funds to
        return Object.keys(client_object).some(loginid => canTransferFundsTo(loginid));
    };

    const canTransferFundsTo = (to_loginid) => {
        if (to_loginid === current_loginid || get('is_virtual', to_loginid) || get('is_virtual') ||
            get('is_disabled', to_loginid)) {
            return false;
        }
        const from_currency = get('currency');
        const to_currency   = get('currency', to_loginid);
        if (!from_currency || !to_currency) {
            return false;
        }
        // only transfer to other accounts that have the same currency as current account if one is maltainvest and one is malta
        if (from_currency === to_currency) {
            // these landing companies are allowed to transfer funds to each other if they have the same currency
            const same_cur_allowed = {
                maltainvest: 'malta',
                malta      : 'maltainvest',
            };
            const from_landing_company = get('landing_company_shortcode');
            const to_landing_company   = get('landing_company_shortcode', to_loginid);
            // if same_cur_allowed[from_landing_company] is undefined and to_landing_company is also undefined, it will return true
            // so we should compare '' === undefined instead
            return (same_cur_allowed[from_landing_company] || '') === to_landing_company;
        }
        // or for other clients if current account is cryptocurrency it should only transfer to fiat currencies and vice versa
        const is_from_crypto = CurrencyUtils.isCryptocurrency(from_currency);
        const is_to_crypto   = CurrencyUtils.isCryptocurrency(to_currency);
        return (is_from_crypto ? !is_to_crypto : is_to_crypto);
    };

    const hasSvgAccount = () => !!(getAllLoginids().find(loginid => /^CR/.test(loginid)));

    const canChangeCurrency = (statement, mt5_login_list, is_current = true) => {
        const currency             = get('currency');
        const has_no_mt5           = mt5_login_list.length === 0;
        const has_no_transaction   = (statement.count === 0 && statement.transactions.length === 0);
        const has_account_criteria = has_no_transaction && has_no_mt5;

        // Current API requirements for currently logged-in user successfully changing their account's currency:
        // 1. User must not have made any transactions
        // 2. User must not have any MT5 account
        // 3. Not be a crypto account
        // 4. Not be a virtual account
        return is_current ? currency && !get('is_virtual') && has_account_criteria && !CurrencyUtils.isCryptocurrency(currency) : has_account_criteria;
    };

    return {
        init,
        isLoggedIn,
        isValidLoginid,
        set,
        get,
        getAllLoginids,
        getAccountType,
        isAccountOfType,
        getAccountOfType,
        hasAccountType,
        hasCurrencyType,
        getAccountTitle,
        responseAuthorize,
        shouldAcceptTnc,
        clearAllAccounts,
        setNewAccount,
        currentLandingCompany,
        shouldCompleteTax,
        getAllAccountsObject,
        getMT5AccountType,
        getBasicUpgradeInfo,
        getLandingCompanyValue,
        getRiskAssessment,
        canTransferFunds,
        hasSvgAccount,
        canChangeCurrency,
    };
})();

module.exports = ClientBase;
