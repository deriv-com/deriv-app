import Cookies from 'js-cookie';
import { getAccountsFromLocalStorage } from '@deriv/utils';
import { Analytics } from '@deriv-com/analytics';
import { LocalStorageUtils, URLConstants, URLUtils } from '@deriv-com/utils';
import { LANDING_COMPANIES } from '../constants/constants';

const isBrowser = () => typeof window !== 'undefined';

const derivComUrl = 'deriv.com';
const derivMeUrl = 'deriv.me';
const derivBeUrl = 'deriv.be';

const supportedDomains = [derivComUrl, derivMeUrl, derivBeUrl];
const domainUrlInitial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
const domainUrl = supportedDomains.includes(domainUrlInitial) ? domainUrlInitial : derivComUrl;

export const derivUrls = Object.freeze({
    DERIV_APP_PRODUCTION: `https://app.${domainUrl}`,
    DERIV_APP_STAGING: `https://staging-app.${domainUrl}`,
    DERIV_COM_PRODUCTION: `https://${domainUrl}`,
    DERIV_COM_PRODUCTION_EU: `https://eu.${domainUrl}`,
    DERIV_COM_STAGING: `https://staging.${domainUrl}`,
    DERIV_HOST_NAME: domainUrl,
    DERIV_P2P_PRODUCTION: `https://p2p.${domainUrl}`,
    DERIV_P2P_STAGING: `https://staging-p2p.${domainUrl}`,
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domainUrl}`,
    SMARTTRADER_STAGING: `https://staging-smarttrader.${domainUrl}`,
});

/**
 * @deprecated Please use 'URLConstants.whatsApp' from '@deriv-com/utils' instead of this.
 */
export const whatsappUrl = 'https://wa.me/35699578341';

let defaultLanguage: string;

export const setUrlLanguage = (lang: string) => {
    defaultLanguage = lang;
};

/**
 * @deprecated Please use 'URLUtils.normalizePath' from '@deriv-com/utils' instead of this.
 */
export const normalizePath = (path: string) => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_./()#])/g, '') : '');

/**
 * @deprecated Please use 'URLUtils.getQueryParameter' from '@deriv-com/utils' instead of this.
 */
export const getActionFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const action = urlParams.get('action');
    return action;
};

export const getUrlSmartTrader = () => {
    const { isStagingDerivApp } = getPlatformFromUrl();
    const localizeLanguage = LocalStorageUtils.getValue<string>('i18n_language');
    const urlLang = URLUtils.getQueryParameter('lang');
    const i18NLanguage = localizeLanguage || urlLang || 'en';

    let baseLink = '';

    if (isStagingDerivApp) {
        baseLink = derivUrls.SMARTTRADER_STAGING;
    } else {
        baseLink = derivUrls.SMARTTRADER_PRODUCTION;
    }

    return `${baseLink}/${i18NLanguage.toLowerCase()}/trading.html`;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        isDerivApp: /^app\.deriv\.(com|me|be)$/i.test(domain),
        isStagingDerivApp: /^staging-app\.deriv\.(com|me|be)$/i.test(domain),
        isTestLink: /^(.*)\.binary\.sx$/i.test(domain),
    };

    return {
        ...resolutions,
        isStaging: resolutions.isStagingDerivApp,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { isStagingDerivApp } = getPlatformFromUrl(domain);

    return isStagingDerivApp;
};

export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

/**
 * @deprecated Please use 'URLUtils.getDerivStaticURL' from '@deriv-com/utils' instead of this.
 */
export const getStaticUrl = (
    path = '',
    language = defaultLanguage?.toLowerCase(),
    isDocument = false,
    isEuUrl = false
) => {
    const host = isEuUrl ? derivUrls.DERIV_COM_PRODUCTION_EU : derivUrls.DERIV_COM_PRODUCTION;
    let lang = language;

    if (lang && lang !== 'en') {
        lang = `/${lang}`;
    } else {
        lang = '';
    }

    if (isDocument) return `${host}/${normalizePath(path)}`;

    // Deriv.com supports languages separated by '-' not '_'
    if (host === derivUrls.DERIV_COM_PRODUCTION && lang.includes('_')) {
        lang = lang.replace('_', '-');
    }

    return `${host}${lang}/${normalizePath(path)}`;
};

export const OUT_SYSTEMS_TRADERSHUB = Object.freeze({
    PRODUCTION: `https://hub.${domainUrl}/tradershub`,
    STAGING: `https://staging-hub.${domainUrl}/tradershub`,
});

export const redirectToOutSystems = (currency = '') => {
    // redirect to OS Tradershub if feature is enabled
    const isOutSystemsRealAccountCreationEnabled = Analytics?.getFeatureValue(
        'trigger_os_real_account_creation',
        false
    );

    if (isOutSystemsRealAccountCreationEnabled) {
        const clientAccounts = getAccountsFromLocalStorage() ?? {};
        if (!Object.keys(clientAccounts).length) return;
        const accountsWithTokens: Record<string, unknown> = {};
        Object.keys(clientAccounts).forEach(loginid => {
            const account = clientAccounts[loginid];
            accountsWithTokens[loginid] = { token: account.token };
        });
        const expires = new Date(new Date().getTime() + 1 * 60 * 1000); // 1 minute

        Cookies.set('os_auth_tokens', JSON.stringify(accountsWithTokens), { domain: URLConstants.baseDomain, expires });

        const params = new URLSearchParams({
            action: 'real-account-signup',
            ...(currency ? { currency } : {}),
            target: LANDING_COMPANIES.MALTAINVEST,
        });
        const baseUrl = isProduction() ? OUT_SYSTEMS_TRADERSHUB.PRODUCTION : OUT_SYSTEMS_TRADERSHUB.STAGING;

        const redirectURL = new URL(`${baseUrl}/redirect`);
        redirectURL.search = params.toString();
        return (window.location.href = redirectURL.toString());
    }
};

export const redirectToStandaloneP2P = () => {
    const clientAccounts = getAccountsFromLocalStorage() ?? {};
    if (!Object.keys(clientAccounts).length) return;

    const filteredAccountsWithTokens: Record<string, unknown> = {};
    Object.keys(clientAccounts).forEach(loginid => {
        const account = clientAccounts[loginid];
        if (account.account_category === 'trading' && account?.currency_type === 'fiat' && account.is_virtual === 0) {
            filteredAccountsWithTokens[loginid] = { token: account.token }; // pass token for real fiat trading account only
        }
    });
    if (!Object.keys(filteredAccountsWithTokens).length) return;

    const expires = new Date(new Date().getTime() + 1 * 60 * 1000); // 1 minute

    Cookies.set('authtoken', JSON.stringify(filteredAccountsWithTokens), {
        domain: URLConstants.baseDomain,
        expires,
        secure: true,
    });

    const baseUrl = isProduction() ? derivUrls.DERIV_P2P_PRODUCTION : derivUrls.DERIV_P2P_STAGING;

    const redirectURL = new URL(`${baseUrl}/redirect?from=tradershub`);
    return (window.location.href = redirectURL.toString());
};
