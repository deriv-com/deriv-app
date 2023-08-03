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
const TOKEN_LIST = 'tokenList';
const ACTIVE_LOGIN_ID = 'active_loginid';
const LANGUAGE = 'lang';
const CONTRACTS_FOR_STORE = 'contractsForStore';

let store = {};
let hasReadystateListener = false;

if (typeof localStorage !== 'undefined') {
    store = localStorage;
}

export const getTokenList = () => {
    store[TOKEN_LIST] = !(TOKEN_LIST in store) ? '[]' : store[TOKEN_LIST];
    try {
        return JSON.parse(store[TOKEN_LIST]);
    } catch (e) {
        store[TOKEN_LIST] = '[]';
        return [];
    }
};

export const setTokenList = (tokenList = []) => {
    store[TOKEN_LIST] = JSON.stringify(tokenList);
};

export const getActiveLoginId = () => {
    store[ACTIVE_LOGIN_ID] = !(ACTIVE_LOGIN_ID in store) ? '' : store[ACTIVE_LOGIN_ID];
    try {
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

// const findAccount = (accountName = '') => getTokenList().findIndex(tokenInfo => tokenInfo.accountName === accountName);

export const findToken = (token = '') => getTokenList().findIndex(tokenInfo => tokenInfo.token === token);

export const addToken = (token, loginInfo, hasRealityCheck, hasTradeLimitation) => {
    const { loginid: accountName } = loginInfo;

    const account = {
        accountName,
        token,
        loginInfo,
        hasRealityCheck,
        hasTradeLimitation,
    };

    return account;
};

export const getToken = token => {
    const tokenList = getTokenList();
    const index = findToken(token);
    return index >= 0 ? tokenList[index] : {};
};

export const removeToken = token => {
    const index = findToken(token);
    if (index > -1) {
        const tokenList = getTokenList();
        tokenList.splice(index, 1);
        setTokenList(tokenList);
    }
};

export const removeAllTokens = () => {
    const is_logging_in = localStorage.getItem('is_logging_in');

    if (!is_logging_in) {
        setActiveLoginId('');
    }

    setTokenList([]);
    dropFromStorage('is_logging_in');
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
                value: getClientAccounts(),
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
    const token_list = getTokenList();
    if (token_list?.length) {
        const active_account = getActiveLoginId();
        const client_accounts_info = token_list;
        if (Array.isArray(client_accounts_info)) {
            const active_account_info = client_accounts_info?.find(account => account.accountName === active_account);
            if (active_account_info?.loginInfo) {
                return active_account_info.loginInfo;
            }
            return {};
        }
        return {};
    }
    return {};
};

export const convertForBinaryStore = clientAccounts => {
    const tokenList = [];
    const accountNames = Object.keys(clientAccounts);
    const accountList = [];

    accountNames.forEach(account => {
        const accountListItem = {
            account_type: clientAccounts[account].account_type,
            currency: clientAccounts[account].currency,
            is_disabled: clientAccounts[account].is_disabled,
            is_virtual: clientAccounts[account].is_virtual,
            landing_company_name: clientAccounts[account].landing_company_name,
            loginid: account,
            trading: clientAccounts[account].trading,
        };

        accountList.push(accountListItem);
    });

    accountNames.forEach((account, index) => {
        let loginInfo = {};

        if (index === 0) {
            loginInfo = {
                accountList,
                balance: clientAccounts[account].balance,
                email: clientAccounts[account].email,
            };
        } else {
            loginInfo = {
                account_type: clientAccounts[account].account_type,
                is_disabled: clientAccounts[account].is_disabled,
            };
        }
        loginInfo = {
            ...loginInfo,
            currency: clientAccounts[account].currency,
            is_virtual: clientAccounts[account].is_virtual,
            landing_company_name: clientAccounts[account].landing_company_name,
            loginid: account,
            trading: clientAccounts[account].trading,
        };
        const accountInfo = {
            loginInfo,
            accountName: account,
            token: clientAccounts[account].token,
            hasRealityCheck: false, // using false as default - needs clarificatio
            hasTradeLimitation: false, // using false as default - needs clarificatio
        };

        tokenList.push(accountInfo);
    });

    return tokenList;
};

export const convertForDerivStore = tokenList => {
    const clientAccounts = {};
    const [acc] = tokenList;
    const list_key = acc?.loginInfo.accountList ? 'accountList' : 'account_list';
    const account_list = [...acc.loginInfo[list_key]];

    tokenList.forEach((account, index) => {
        const accId = account.accountName;
        const match = account_list.find(_acc => _acc?.loginid === accId);
        let client_account = {
            account_type: match.account_type,
            currency: account.loginInfo.currency,
            is_disabled: match.is_disabled,
            is_virtual: account.loginInfo.is_virtual,
            landing_company_shortcode: account.loginInfo.landing_company_name, // how shortcode is different from name?
            trading: account.loginInfo.trading,
            token: account.token,
            excluded_until: '', // self-exclusion wont work at this stage; needs to be copied form deriv-app
            landing_company_name: account.landing_company_name,
        };

        if (index === 0) {
            client_account = {
                ...client_account,
                email: account.loginInfo.email,
                session_start: 0, // using zero as default, will be overwriten at deriv.app load
                balance: account.loginInfo.balance,
                accepted_bch: 0, // no clue what this is
            };
        }
        clientAccounts[accId] = client_account;
    });

    return clientAccounts;
};

export const getLanguage = () => {
    const parsed_url = parseQueryString().lang || parseQueryString().l;
    const parsed_valid_url =
        parsed_url?.length > 1 ? document.location.search.match(/(lang|l)=([a-z]{2})/)[2] : parsed_url;

    const lang = getLang();
    const supported_storage_lang = lang in supported_languages ? lang : null;
    const get_cookie_lang = Cookies.get('user_language');
    const getUserLang = () => {
        if (parsed_valid_url) return parsed_valid_url;
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

export const updateTokenList = () => {
    // eslint-disable-next-line no-console
    console.log('updateTokenList updateTokenList updateTokenList');
    const token_list = getTokenList();
    if (token_list.length) {
        const active_account = getActiveAccountFromAccountsList(token_list);
        if ('loginInfo' in active_account) {
            const current_login_id = getActiveLoginId();
            token_list.forEach(token => {
                if (current_login_id === token.loginInfo.loginid) {
                    setActiveLoginId(token.loginInfo.loginid);
                }
            });
            setClientAccounts(convertForDerivStore(token_list));
            syncWithDerivApp();
        }
    }
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
