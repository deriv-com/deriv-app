import { LiveApi }     from 'binary-live-api';
import { getLanguage } from '@deriv/translations';
import AppIds          from './appIdResolver';
import {
    addToken,
    removeToken,
    getTokenList,
    removeAllTokens,
}                      from '../../utils/tokenHelper';

export const getCustomEndpoint = () => ({
    url  : localStorage.getItem('config.server_url'),
    appId: localStorage.getItem('config.app_id'),
});

const isRealAccount = () => {
    const accountList = JSON.parse(localStorage.getItem('tokenList') || '{}');
    const activeToken = localStorage.getItem('activeToken') || [];
    let activeAccount = null;
    let isReal = false;
    try {
        activeAccount = accountList.filter(account => account.token === activeToken);
        isReal = !activeAccount[0].accountName.startsWith('VRT');
    } catch (e) {} // eslint-disable-line no-empty
    return isReal;
};

const getDomainAppId = () => AppIds[document.location.hostname.replace(/^www./, '')];

export const getDefaultEndpoint = () => ({
    url  : isRealAccount() ? 'green.binaryws.com' : 'blue.binaryws.com',
    appId: localStorage.getItem('config.default_app_id') || getDomainAppId() || 19111,
});

export const getServerAddressFallback = () => getCustomEndpoint().url || getDefaultEndpoint().url;

export const getAppIdFallback = () => getCustomEndpoint().appId || getDefaultEndpoint().appId;

export const getWebSocketURL = () => `wss://${getServerAddressFallback()}/websockets/v3`;

export const generateLiveApiInstance = () => new LiveApi({
    apiUrl  : getWebSocketURL(),
    language: getLanguage().toUpperCase(),
    appId   : getAppIdFallback(),
});

export async function addTokenIfValid(token, tokenObjectList) {
    // Create a new instance of api, send autorize req,
    const api = generateLiveApiInstance();
    try {
        const { authorize } = await api.authorize(token);
        const { landing_company_name: lcName } = authorize;
        const {
            landing_company_details: { has_reality_check: hasRealityCheck },
        } = await api.getLandingCompanyDetails(lcName);
        addToken(token, authorize, !!hasRealityCheck, ['iom', 'malta'].includes(lcName) && authorize.country === 'gb');

        const { account_list: accountList } = authorize;
        if (accountList.length > 1) {
            tokenObjectList.forEach(tokenObject => {
                if (tokenObject.token !== token) {
                    const account = accountList.filter(o => o.loginid === tokenObject.accountName);
                    if (account.length) {
                        addToken(tokenObject.token, account[0], false, false);
                    }
                }
            });
        }
    } catch (e) {
        if (tokenObjectList && tokenObjectList.length !== 0) {
            removeToken(tokenObjectList[0].token);
        }
        throw e;
    }
    return api.disconnect();
}

export const logoutAllTokens = () =>
    new Promise(resolve => {
        const api = generateLiveApiInstance();
        const tokenList = getTokenList();
        const logout = () => {
            removeAllTokens();
            api.disconnect();
            resolve();
        };
        if (tokenList.length === 0) {
            logout();
        } else {
            api.authorize(tokenList[0].token).then(() => {
                api.logOut().then(logout, logout);
            }, logout);
        }
    });
