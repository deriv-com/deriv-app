import { isLoggedIn, getClientAccounts } from '@storage';
import { api_base } from '@api-base';

const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// TODO: [duplicate_code] - Move this to shared package
// check if client is from EU
export const isEu = country => eu_countries.includes(country);

export const isEuByAccount = (account = {}) => {
    const { loginInfo = {} } = account;
    return eu_countries.includes(loginInfo.country);
};

export const isEU = country_code => eu_countries.includes(country_code);

export const isEuLandingCompany = landing_company => /^(maltainvest|malta|iom)$/.test(landing_company);

export const hasEuAccount = token_list =>
    token_list.some(token_obj => isEuLandingCompany(token_obj.loginInfo.landing_company_name));

const isLowRisk = (financial, gaming, upgrade) => {
    const { shortcode: f_sc = '' } = financial || {};
    const { shortcode: g_sc = '' } = gaming || {};
    return (f_sc === 'maltainvest' && g_sc === 'svg') || (upgrade?.includes('svg') && upgrade?.includes('maltainvest'));
};

const isHighRisk = (financial_company, gaming_company, risk_classification) => {
    const restricted_countries =
        financial_company?.shortcode === 'svg' ||
        (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

    const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
    return risk_classification === 'high' || high_risk_landing_company || restricted_countries;
};

export const isMultiplier = landing_company_list => {
    const multiplier_account = landing_company_list?.financial_company?.legal_allowed_contract_categories;
    const is_multiplier = multiplier_account?.includes('multiplier');
    return {
        is_multiplier: multiplier_account?.length === 1 && is_multiplier,
        country_code: landing_company_list.id,
    };
};

export const checkSwitcherType = () => {
    if (!isLoggedIn()) return null;
    const account_info = { ...api_base.account_info };
    if (!account_info) return null;
    const client_accounts = getClientAccounts();
    const landing_company = { ...api_base.landing_company };
    const account_status = { ...api_base.account_status };
    const { country, upgradeable_landing_companies = [] } = account_info;
    const is_eu = isEu(country);
    const { is_multiplier, country_code } = isMultiplier(landing_company);
    const { financial_company, gaming_company } = landing_company;

    const { risk_classification } = account_status || {};

    let is_low_risk = isLowRisk(financial_company, gaming_company, upgradeable_landing_companies);
    let is_high_risk = isHighRisk(financial_company, gaming_company, risk_classification);
    const low_risk_no_account = is_low_risk && Object.keys(client_accounts).length === 1;
    const high_risk_no_account = is_high_risk && Object.keys(client_accounts).length === 1;
    const is_high_risk_or_eu = is_eu && is_high_risk;

    if (low_risk_no_account) is_low_risk = false;
    if (high_risk_no_account) is_high_risk = false;
    if (is_low_risk) is_high_risk = false;
    if (is_high_risk) is_low_risk = false;

    return {
        low_risk: is_low_risk,
        high_risk: !!is_high_risk,
        low_risk_without_account: low_risk_no_account,
        high_risk_without_account: high_risk_no_account,
        high_risk_or_eu: is_high_risk_or_eu,
        is_multiplier: !!is_multiplier,
        country_code: country_code || country,
    };
};
