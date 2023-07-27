import { api_base } from '@api-base';
import {
    addToken,
    removeToken,
    getTokenList,
    removeAllTokens,
    setStorage,
    syncWithDerivApp,
    getLanguage,
    updateTokenList,
    getCustomEndpoint,
    getAppIdFallback,
} from '@storage';
import { getRelatedDeriveOrigin } from '@utils';
import GTM from './gtm';

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
        const { authorize } = await api_base.api.authorize(token);
        const { landing_company_name: lcName } = authorize;
        const {
            landing_company_details: { has_reality_check: hasRealityCheck },
        } = await api_base.api.send({ landing_company_details: lcName });
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
            api_base.api
                .authorize(tokenList?.[0].token)
                .then(() => {
                    api_base.api.send({ logout: 1 }).finally(logout);
                })
                .catch(logout);
        }
    });

export const logoutAndReset = () =>
    new Promise(resolve => {
        logoutAllTokens().then(() => {
            updateTokenList();
            setStorage('active_loginid', null);
            syncWithDerivApp();
            resolve();
        });
    });
