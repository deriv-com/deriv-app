/* eslint-disable import/prefer-default-export */
import api from '../botPage/view/deriv/api';
import { get as getStorage, getTokenList } from '../common/utils/storageManager';
import { isLoggedIn } from '../botPage/view/deriv/utils';
/* eslint-disable camelcase */
export const isEuLandingCompany = landing_company => /^(maltainvest|malta|iom)$/.test(landing_company);

export const hasEuAccount = token_list =>
    token_list.some(token_obj => isEuLandingCompany(token_obj.loginInfo.landing_company_name));

export const isEuCountry = async () => {
    const { website_status } = await api.send({ website_status: 1 });
    const { clients_country } = website_status;
    const { landing_company } = await api.send({ landing_company: clients_country });
    const { financial_company, gaming_company } = landing_company;

    const eu_excluded_regexp = /^mt$/;
    const financial_shortcode = financial_company ? financial_company.shortcode : false;
    const gaming_shortcode = gaming_company ? gaming_company.shortcode : false;

    if (financial_shortcode || gaming_shortcode) {
        return isEuLandingCompany(financial_shortcode) || isEuLandingCompany(gaming_shortcode);
    }

    return eu_excluded_regexp.test(clients_country);
};
/* eslint-enable */

const isEmptyObject = obj => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

const isLowRisk = async (financial_company, gaming_company, token_list) => {
    const upgradable_companies = token_list.map(data => {
        const {
            loginInfo: { upgradeable_landing_companies },
        } = data;
        return upgradeable_landing_companies;
    });
    const financial_shortcode = financial_company?.shortcode;
    const gaming_shortcode = gaming_company?.shortcode;
    const low_risk_landing_company = financial_shortcode === 'maltainvest' && gaming_shortcode === 'svg';
    return (
        low_risk_landing_company ||
        (upgradable_companies[0]?.includes('svg') && upgradable_companies[0]?.includes('maltainvest'))
    );
};

const isHighRisk = async (financial_company, gaming_company, risk_classification) => {
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
        is_multiplier: multiplier_account.length === 1 && is_multiplier,
        country_code: landing_company_list.id,
    };
};

export const checkSwitcherType = async () => {
    const is_logged_in = isLoggedIn();
    if (!is_logged_in) return null;
    const token_list = await getTokenList();
    const is_eu = await isEuCountry();
    if (!token_list[0]?.loginInfo.country) return null;
    const { landing_company } = await api.send({
        landing_company: token_list[0]?.loginInfo.country,
    });

    const { is_multiplier, country_code } = await isMultiplier(landing_company);

    const { financial_company, gaming_company } = landing_company;
    const account_status = await api.send({ get_account_status: 1 });


    const {
        get_account_status: { risk_classification },
    } = account_status;

    let is_low_risk = await isLowRisk(financial_company, gaming_company, token_list);
    let is_high_risk = await isHighRisk(financial_company, gaming_company, risk_classification);

    const client_accounts = JSON.parse(getStorage('client.accounts'));
    if (isEmptyObject(client_accounts || token_list)) return false;

    const low_risk_no_account = is_low_risk && Object.keys(client_accounts).length === 1;

    const high_risk_no_account = is_high_risk && Object.keys(client_accounts).length === 1;

    const is_high_risk_or_eu = is_eu && is_high_risk;

    if (low_risk_no_account) {
        is_low_risk = false;
    }
    if (high_risk_no_account) {
        is_high_risk = false;
    }

    if (is_low_risk) {
        is_high_risk = false;
    }
    if (is_high_risk) {
        is_low_risk = false;
    }

    return {
        low_risk: is_low_risk,
        high_risk: is_high_risk,
        low_risk_without_account: low_risk_no_account,
        high_risk_without_account: high_risk_no_account,
        high_risk_or_eu: is_high_risk_or_eu,
        is_multiplier,
        country_code,
    };
};
