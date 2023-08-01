import { AppConstants } from '@constants';
import {
    addToken,
    removeToken,
    getTokenList,
    removeAllTokens,
    set as setStorage,
    syncWithDerivApp,
    getLanguage,
    updateTokenList,
    getCustomEndpoint,
    getAppIdFallback,
} from '@storage';
import { parseQueryString, getRelatedDeriveOrigin, queryToObjectArray } from '@utils';
import GTM from './gtm';
import api from '../botPage/view/deriv/api';

export const oauthLogin = (done = () => 0) => {
    const queryStr = parseQueryString();
    const tokenObjectList = queryToObjectArray(queryStr);

    if (tokenObjectList.length) {
        $('#main').hide();
        addTokenIfValid(tokenObjectList[0].token, tokenObjectList).then(() => {
            const accounts = getTokenList();
            if (accounts.length) {
                setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, accounts[0].token);
            }
            document.location = 'bot.html';
        });
    } else {
        done();
    }
};

const generateOAuthDomain = () => {
    const related_deriv_origin = getRelatedDeriveOrigin;
    const endpointUrl = getCustomEndpoint().url;

    if (endpointUrl) {
        return endpointUrl;
    }

    if (related_deriv_origin.is_offical) {
        return `oauth.deriv.${related_deriv_origin.extension}`;
    }

    return 'oauth.deriv.com';
};

export const generateWebSocketURL = serverUrl => `wss://${serverUrl}`;

export const getOAuthURL = () =>
    `https://${generateOAuthDomain()}/oauth2/authorize?app_id=${getAppIdFallback()}&l=${getLanguage()?.toUpperCase()}&brand=deriv`;

export async function addTokenIfValid(token, tokenObjectList) {
    try {
        const { authorize } = await api.authorize(token);
        const { landing_company_name: lcName } = authorize;
        const {
            landing_company_details: { has_reality_check: hasRealityCheck },
        } = await api.send({ landing_company_details: lcName });
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
        removeToken(tokenObjectList[0].token);
        GTM.setVisitorId();
        throw e;
    }
}

export const logoutAllTokens = () =>
    new Promise(resolve => {
        const tokenList = getTokenList();
        const logout = () => {
            removeAllTokens();
            resolve();
        };
        if (tokenList.length === 0) {
            logout();
        } else {
            api.authorize(tokenList?.[0].token)
                .then(() => {
                    api.send({ logout: 1 }).finally(logout);
                })
                .catch(logout);
        }
    });

export const logoutAndReset = () =>
    new Promise(resolve => {
        logoutAllTokens().then(() => {
            updateTokenList();
            setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, '');
            setStorage('active_loginid', null);
            syncWithDerivApp();
            resolve();
        });
    });
