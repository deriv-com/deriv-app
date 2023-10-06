import { api_base } from '@api-base';
import {
    setClientAccounts,
    addToken,
    removeAllTokens,
    syncWithDerivApp,
    getLanguage,
    getCustomEndpoint,
    getAppIdFallback,
    setActiveLoginId,
    getClientAccounts,
    getActiveLoginId,
} from '@storage';
import { getRelatedDeriveOrigin } from '@utils';
import GTM from '@utilities/integrations/gtm';

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

export async function addTokenIfValid(token) {
    try {
        const { authorize } = await api_base.authorize(token);
        const { landing_company_name } = authorize;
        const { has_reality_check } = api_base.landing_company_details;
        const account = addToken(
            token,
            authorize,
            !!has_reality_check,
            ['iom', 'malta'].includes(landing_company_name) && authorize.country === 'gb'
        );
        return account;
    } catch (e) {
        GTM.setVisitorId();
        throw e;
    }
}

export async function loginAndSetTokens(token_list = []) {
    try {
        let account;
        const login_id = getActiveLoginId();
        if (login_id) {
            account = token_list.find(t => t.accountName === login_id);
        } else {
            const [first_account] = token_list; // first account will be the active account
            account = first_account;
        }

        if (!account.token) throw new Error('Token not found');
        const { authorize: account_info } = await api_base.authorize(account.token);
        const { landing_company_name, account_list = [] } = account_info;
        const { has_reality_check } = api_base.landing_company_details;
        const has_trade_limitation = ['iom', 'malta'].includes(landing_company_name) && account_info.country === 'gb';

        const accounts_list = {};

        token_list.forEach(token => {
            const acc = account_list.find(a => a.loginid === token.accountName);
            let temp_account = {
                account_category: acc.account_category,
                account_type: acc.account_type,
                created_at: acc.created_at,
                currency: token.cur,
                excluded_until: '', // self-exclusion wont work at this stage; needs to be copied form deriv-app
                is_disabled: acc.is_disabled,
                is_virtual: acc.is_virtual,
                landing_company_name: acc.landing_company_name,
                landing_company_shortcode: acc.landing_company_name, // how shortcode is different from name?
                linked_to: acc.linked_to,
                token: token.token,
            };
            if (account_info?.loginid === token.accountName) {
                temp_account = {
                    ...temp_account,
                    upgradeable_landing_companies: account_info.upgradeable_landing_companies,
                    email: account_info.email,
                    residence: account_info.country,
                    session_start: 0, // it will be synced from the app.deriv.com
                    accepted_bch: 0,
                    balance: account_info.balance,
                    hasRealityCheck: !!has_reality_check,
                    hasTradeLimitation: has_trade_limitation,
                };
            }
            accounts_list[token.accountName] = temp_account;
        });
        setActiveLoginId(account.accountName);
        setClientAccounts(accounts_list);
        return { account_info, accounts_list };
    } catch (e) {
        GTM.setVisitorId();
        throw e;
    }
}

export const logoutAllTokens = () =>
    new Promise(resolve => {
        const loginid = getActiveLoginId();
        const account_list = getClientAccounts();

        const logout = () => {
            removeAllTokens();
            resolve();
        };

        if (loginid && account_list[loginid]?.token) {
            api_base.api
                .authorize(account_list[loginid]?.token)
                .then(() => {
                    api_base.api.send({ logout: 1 }).finally(logout);
                })
                .catch(logout);
        } else {
            logout();
        }
    });

export const logoutAndReset = () =>
    new Promise(resolve => {
        logoutAllTokens().then(() => {
            setActiveLoginId('');
            syncWithDerivApp();
            resolve();
        });
    });
