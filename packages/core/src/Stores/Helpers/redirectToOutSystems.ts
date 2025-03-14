import Cookies from 'js-cookie';

import { getAccountsFromLocalStorage } from '@deriv/utils';
import { URLConstants } from '@deriv-com/utils';

const isBrowser = () => typeof window !== 'undefined';

const derivComUrl = 'deriv.com';

const supportedDomains = [derivComUrl];
const domainUrlInitial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
export const isOutsystemsSupported = supportedDomains.includes(domainUrlInitial);

export const LANDING_COMPANIES = Object.freeze({
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
});

export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

export const OUT_SYSTEMS_TRADERSHUB = Object.freeze({
    PRODUCTION: `https://hub.deriv.com/tradershub`,
    STAGING: `https://staging-hub.deriv.com/tradershub`,
});

export const redirectToOutSystems = (landingCompany?: string) => {
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
        target: landingCompany || LANDING_COMPANIES.MALTAINVEST,
    });
    const baseUrl = isProduction() ? OUT_SYSTEMS_TRADERSHUB.PRODUCTION : OUT_SYSTEMS_TRADERSHUB.STAGING;
    const redirectURL = new URL(`${baseUrl}/redirect`);
    redirectURL.search = params.toString();
    return (window.location.href = redirectURL.toString());
};
