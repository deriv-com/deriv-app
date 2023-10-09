import Cookies from 'js-cookie';
import { parseQueryString, getRelatedDeriveOrigin, getDomainAppId } from '@utils';
import { AppConstants } from '@constants';
import { supported_languages, redirectToSupportedLang } from '@i18n';
import { setCookieLanguage } from './common/utils/cookieManager';

let store = {};
let hasReadystateListener = false;

if (typeof localStorage !== 'undefined') {
    store = localStorage;
}

export const getTokenList = () => {
    store.tokenList = !('tokenList' in store) ? '[]' : store.tokenList;
    try {
        return JSON.parse(store.tokenList);
    } catch (e) {
        store.tokenList = '[]';
        return [];
    }
};

export const setTokenList = (tokenList = []) => {
    store.tokenList = JSON.stringify(tokenList);
};

const findAccount = (accountName = '') => getTokenList().findIndex(tokenInfo => tokenInfo.accountName === accountName);

export const findToken = (token = '') => getTokenList().findIndex(tokenInfo => tokenInfo.token === token);

export const addToken = (token, loginInfo, hasRealityCheck, hasTradeLimitation) => {
    const { loginid: accountName } = loginInfo;
    const tokenList = getTokenList();
    const tokenIndex = findToken(token);
    const accountIndex = findAccount(accountName);
    if (tokenIndex < 0 && accountIndex < 0) {
        tokenList.push({
            accountName,
            token,
            loginInfo,
            hasRealityCheck,
            hasTradeLimitation,
        });
        setTokenList(tokenList);
    }
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
        store.tokenList = tokenList;
    }
};

export const removeAllTokens = () => {
    const is_logging_in = localStorage.getItem('is_logging_in');

    if (!is_logging_in) {
        set('active_loginid', null);
    }

    delete store.tokenList;
    delete localStorage.is_logging_in;

    set('tokenList', '[]');
    set('client.accounts', '[]');
    syncWithDerivApp();
};

export const isDone = varName => varName in store;

export const setDone = varName => {
    store[varName] = true;
};

export const set = (varName, value) => {
    store[varName] = value;
};

export const get = varName => store[varName];

export const remove = varName => delete store[varName];

export const syncWithDerivApp = () => {
    const iframe = document.getElementById('localstorage-sync');
    const { origin } = getRelatedDeriveOrigin();

    const postMessages = () => {
        iframe.contentWindow.postMessage(
            {
                key: 'client.accounts',
                value: get('client.accounts'),
            },
            origin
        );
        iframe.contentWindow.postMessage(
            {
                key: 'active_loginid',
                value: get('active_loginid'),
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
    const client_accounts_storage = get('tokenList');
    if (client_accounts_storage?.length) {
        const active_account = get('active_loginid');
        const client_accounts_info = JSON.parse(client_accounts_storage);
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
        const accountListItem = {};

        accountListItem.account_type = clientAccounts[account].account_type;
        accountListItem.currency = clientAccounts[account].currency;
        accountListItem.is_disabled = clientAccounts[account].is_disabled;
        accountListItem.is_virtual = clientAccounts[account].is_virtual;
        accountListItem.landing_company_name = clientAccounts[account].landing_company_name;
        accountListItem.loginid = account;
        accountListItem.trading = clientAccounts[account].trading;

        accountList.push(accountListItem);
    });

    accountNames.forEach((account, index) => {
        const accountInfo = {};
        const loginInfo = {};

        if (index === 0) {
            loginInfo.accountList = accountList;
            loginInfo.balance = clientAccounts[account].balance;
            loginInfo.email = clientAccounts[account].email;
        } else {
            loginInfo.account_type = clientAccounts[account].account_type;
            loginInfo.is_disabled = clientAccounts[account].is_disabled;
        }

        loginInfo.currency = clientAccounts[account].currency;
        loginInfo.is_virtual = clientAccounts[account].is_virtual;
        loginInfo.landing_company_name = clientAccounts[account].landing_company_name;
        loginInfo.loginid = account;
        loginInfo.trading = clientAccounts[account].trading;

        accountInfo.accountName = account;
        accountInfo.token = clientAccounts[account].token;
        accountInfo.loginInfo = loginInfo;
        accountInfo.hasRealityCheck = false; // using false as default - needs clarification
        accountInfo.hasTradeLimitation = false; // using false as default - needs clarification

        tokenList.push(accountInfo);
    });

    return tokenList;
};

export const convertForDerivStore = tokenList => {
    const clientAccounts = {};
    const accountList = tokenList[0]?.loginInfo.accountList ? 'accountList' : 'account_list';
    tokenList.forEach((account, index) => {
        const accId = account.accountName;
        clientAccounts[accId] = {};
        clientAccounts[accId].account_type =
            tokenList[0].loginInfo[accountList]?.find(acc => acc?.loginid === accId)?.account_type ||
            account.loginInfo.account_type;
        clientAccounts[accId].currency = account.loginInfo.currency;
        clientAccounts[accId].is_disabled =
            tokenList[0].loginInfo[accountList]?.find(acc => acc?.loginid === accId)?.is_disabled ||
            account.loginInfo.is_disabled;
        clientAccounts[accId].is_virtual = account.loginInfo.is_virtual;
        clientAccounts[accId].landing_company_shortcode = account.loginInfo.landing_company_name; // how shortcode is different from name?
        clientAccounts[accId].trading = account.loginInfo.trading;
        clientAccounts[accId].token = account.token;
        clientAccounts[accId].excluded_until = ''; // self-exclusion wont work at this stage; needs to be copied form deriv-app
        clientAccounts[accId].landing_company_name = account.landing_company_name;

        if (index === 0) {
            clientAccounts[accId].email = account.loginInfo.email;
            clientAccounts[accId].session_start = 0; // using zero as default, will be overwriten at deriv.app load
            clientAccounts[accId].balance = account.loginInfo.balance;
            clientAccounts[accId].accepted_bch = 0; // no clue what this is
        }
    });

    return clientAccounts;
};

export const getLanguage = () => {
    const parsed_url = parseQueryString().lang || parseQueryString().l;
    const supported_storage_lang = get('lang') in supported_languages ? get('lang') : null;
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
    set('lang', lang);
    setCookieLanguage(lang);
    return lang;
};

export const isLoggedIn = () => !!getTokenList()?.length;

export const getActiveToken = tokenList => {
    const active_token = get(AppConstants.STORAGE_ACTIVE_TOKEN);
    const activeTokenObject = tokenList.filter(tokenObject => tokenObject.token === active_token);
    return activeTokenObject.length ? activeTokenObject[0] : tokenList[0];
};

export const updateTokenList = () => {
    const token_list = getTokenList();
    if (token_list.length) {
        const active_token = getActiveToken(token_list);
        if ('loginInfo' in active_token) {
            const current_login_id = get('active_loginid') || '';
            token_list.forEach(token => {
                if (current_login_id === token.loginInfo.loginid) {
                    set('active_loginid', token.loginInfo.loginid);
                }
            });
            set('client.accounts', JSON.stringify(convertForDerivStore(token_list)));
            syncWithDerivApp();
        }
    }
};

const isRealAccount = () => {
    const accountList = JSON.parse(get('tokenList') || '{}');
    const activeToken = get(AppConstants.STORAGE_ACTIVE_TOKEN) || [];
    let activeAccount = null;
    let isReal = false;
    try {
        activeAccount = accountList.filter(account => account.token === activeToken);
        isReal = !activeAccount[0].accountName.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

export const getDefaultEndpoint = () => ({
    url: isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: get('config.default_app_id') || getDomainAppId(),
});

export const getAppIdFallback = () => getCustomEndpoint().appId || getDefaultEndpoint().appId;

export const getCustomEndpoint = () => ({
    url: get('config.server_url'),
    appId: get('config.app_id'),
});
