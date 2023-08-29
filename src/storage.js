import Cookies from 'js-cookie';
import { parseQueryString, getRelatedDeriveOrigin, getDomainAppId } from '@utils';
import { supported_languages, redirectToSupportedLang } from '@i18n';
import { setCookieLanguage } from './common/utils/cookieManager';

const CLIENT_ACCOUNT = 'client.accounts';
const CLIENT_COUNTRY = 'client.country';
const CONFIG_SERVER_URL = 'config.server_url';
const CONFIG_APP_ID = 'config.app_id';
const DEFAULT_APP_ID = 'config.default_app_id';
const TOUR_STATE = 'tour_state';
const ACTIVE_LOGIN_ID = 'active_loginid';
const LANGUAGE = 'lang';
const CONTRACTS_FOR_STORE = 'contractsForStore';

let store = {};
let hasReadystateListener = false;

if (typeof localStorage !== 'undefined') {
    store = localStorage;
}

export const getActiveLoginId = () => {
    store[ACTIVE_LOGIN_ID] = !(ACTIVE_LOGIN_ID in store) ? '' : store[ACTIVE_LOGIN_ID];
    try {
        if (store[ACTIVE_LOGIN_ID] === 'null' || store[ACTIVE_LOGIN_ID] === 'undefined') return '';
        return store[ACTIVE_LOGIN_ID];
    } catch (e) {
        store[ACTIVE_LOGIN_ID] = '';
        return '';
    }
};

export const setActiveLoginId = (loginId = '') => {
    store[ACTIVE_LOGIN_ID] = loginId;
};

export const getClientAccounts = () => {
    store[CLIENT_ACCOUNT] = !(CLIENT_ACCOUNT in store) ? '{}' : store[CLIENT_ACCOUNT];
    try {
        return JSON.parse(store[CLIENT_ACCOUNT]);
    } catch (e) {
        store[CLIENT_ACCOUNT] = '{}';
        return {};
    }
};

export const setClientAccounts = (clientAccounts = {}) => {
    store[CLIENT_ACCOUNT] = JSON.stringify(clientAccounts);
};

export const getTourState = () => {
    store[TOUR_STATE] = !(TOUR_STATE in store) ? '' : store[TOUR_STATE];
    try {
        return parseInt(store[TOUR_STATE]);
    } catch (e) {
        store[TOUR_STATE] = '';
        return '';
    }
};

export const closeTour = () => {
    store[TOUR_STATE] = Date.now();
};

export const getClientCountry = () => {
    store[CLIENT_COUNTRY] = !(CLIENT_COUNTRY in store) ? '' : store[CLIENT_COUNTRY];
    return store[CLIENT_COUNTRY];
};

export const setClientCountry = (clientCountry = '') => {
    store[CLIENT_COUNTRY] = clientCountry;
};

export const getConfigURL = () => {
    store[CONFIG_SERVER_URL] = !(CONFIG_SERVER_URL in store) ? '' : store[CONFIG_SERVER_URL];
    return store[CONFIG_SERVER_URL];
};

export const setConfigURL = (url = '') => {
    store[CONFIG_SERVER_URL] = url;
};

export const getConfigAppID = () => {
    store[CONFIG_APP_ID] = !(CONFIG_APP_ID in store) ? '' : store[CONFIG_APP_ID];
    return store[CONFIG_APP_ID];
};

export const setConfigAppID = (id = '') => {
    store[CONFIG_APP_ID] = id;
};

export const getLang = () => {
    store[LANGUAGE] = !(LANGUAGE in store) ? '' : store[LANGUAGE];
    return store[LANGUAGE];
};

export const setLang = (lang = '') => {
    store[LANGUAGE] = lang;
};

export const getContractsForStore = () => {
    store[CONTRACTS_FOR_STORE] = !(CONTRACTS_FOR_STORE in store) ? '[]' : store[CONTRACTS_FOR_STORE];
    try {
        return JSON.parse(store[CONTRACTS_FOR_STORE]);
    } catch (e) {
        store[CONTRACTS_FOR_STORE] = '[]';
        return [];
    }
};

export const setContractsForStore = (contractsForStore = {}) => {
    store[CONTRACTS_FOR_STORE] = JSON.stringify(contractsForStore);
};

export const getDefaultAppId = () => {
    store[DEFAULT_APP_ID] = !(DEFAULT_APP_ID in store) ? '' : store[DEFAULT_APP_ID];
    return store[DEFAULT_APP_ID];
};

export const dropFromStorage = varName => delete store[varName];

export const addToken = (token, loginInfo, hasRealityCheck, hasTradeLimitation) => {
    const { loginid: accountName } = loginInfo;
    const account = {
        accountName,
        token,
        loginInfo: { ...loginInfo },
        hasRealityCheck,
        hasTradeLimitation,
    };

    return account;
};

export const getActiveToken = (client_login_id = '') => {
    const login_id = client_login_id || getActiveLoginId();
    const client_accounts = getClientAccounts();
    const account = client_accounts[login_id];
    return account?.token;
};

export const removeAllTokens = () => {
    setActiveLoginId('');
    setClientAccounts({});
    syncWithDerivApp(); // To clear the session from app.deriv.com as well via localstoragesync
};

export const isDone = varName => varName in store;

export const syncWithDerivApp = () => {
    const iframe = document.getElementById('localstorage-sync');
    const { origin } = getRelatedDeriveOrigin();

    const postMessages = () => {
        iframe.contentWindow.postMessage(
            {
                key: CLIENT_ACCOUNT,
                value: JSON.stringify(getClientAccounts()),
            },
            origin
        );
        iframe.contentWindow.postMessage(
            {
                key: 'active_loginid',
                value: getActiveLoginId(),
            },
            origin
        );
    };
    if (iframe) {
        if (document.readyState === 'complete') {
            postMessages();
            return;
        }
        if (!hasReadystateListener) {
            hasReadystateListener = true;
            document.addEventListener('readystatechange', () => {
                postMessages();
            });
        }
    }
};

export const getActiveAccount = () => {
    const active_login_id = getActiveLoginId();
    const client_accounts = getClientAccounts();
    if (active_login_id && client_accounts?.[active_login_id]?.token) {
        return client_accounts?.[active_login_id];
    }
    return {};
};

export const getLanguage = () => {
    const parsed_url = parseQueryString().lang || parseQueryString().l;
    const supported_storage_lang = getLang() in supported_languages ? getLang() : null;
    const get_cookie_lang = Cookies.get('user_language');
    const getUserLang = () => {
        if (parsed_url) return parsed_url;
        if (supported_storage_lang) return supported_storage_lang;
        if (get_cookie_lang) return get_cookie_lang;
        return 'en';
    };
    const query_lang = getUserLang();
    const is_query_lang_supported = query_lang in supported_languages;

    if (is_query_lang_supported) {
        return setLanguage(query_lang);
    }

    redirectToSupportedLang('en');
    return setLanguage('en');
};

export const setLanguage = lang => {
    setLang(lang);
    setCookieLanguage(lang);
    return lang;
};

export const isLoggedIn = () => {
    const client_accounts = getClientAccounts();
    const active_account = getActiveLoginId();
    return active_account in client_accounts;
};

export const getActiveAccountFromAccountsList = (accounts = []) => {
    const active_loginid = getActiveLoginId();
    const active_account = accounts.find(acc => acc.accountName === active_loginid);
    return active_account || accounts[0];
};

const isRealAccount = () => {
    const active_loginid = getActiveLoginId();
    let isReal = false;
    try {
        isReal = !active_loginid?.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

export const getDefaultEndpoint = () => ({
    url: isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: getDefaultAppId() || getDomainAppId(),
});

export const getAppIdFallback = () => getCustomEndpoint().appId || getDefaultEndpoint().appId;

export const getCustomEndpoint = () => ({
    url: getConfigURL(),
    appId: getConfigAppID(),
});

export const getServerAddressFallback = () => getCustomEndpoint().url || getDefaultEndpoint().url;
