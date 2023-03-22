/* eslint-disable import/prefer-default-export */
import api from '../botPage/view/deriv/api';
import { get as getStorage, getTokenList } from '../common/utils/storageManager';
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

const isLowRisk = (financial_company, gaming_company, token_list) => {
    const upgradable_companies = [];
    token_list.map((data) => {
        const { loginInfo: { upgradeable_landing_companies } } = data;
        upgradable_companies.push(upgradeable_landing_companies);
    });
    const financial_shortcode = financial_company ? financial_company.shortcode : false;
    const gaming_shortcode = gaming_company ? gaming_company.shortcode : false;

    const low_risk_landing_company = financial_shortcode === 'maltainvest' && gaming_shortcode === 'svg';
    return low_risk_landing_company || (upgradable_companies?.include('svg') && upgradable_companies?.include('maltainvest'));
}

const isHighRisk = (financial_company, gaming_company, risk_classification) => {
    const restricted_countries =
        financial_company?.shortcode === 'svg' ||
        (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

    const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
    return high_risk_landing_company || risk_classification === 'high' || restricted_countries;
}

export const checkSwitcherType = async () => {
    const is_eu = await isEuCountry();
    const { website_status } = await api.send({ website_status: 1 });
    const { clients_country } = website_status;
    const { landing_company } = await api.send({ landing_company: clients_country });
    const { financial_company, gaming_company } = landing_company;
    const account_status = await api.send({ 'get_account_status': 1 })
    const { risk_classification } = account_status;
    const token_list = getTokenList();
    const is_low_risk = isLowRisk(financial_company, gaming_company, token_list);
    const is_high_risk = isHighRisk(financial_company, gaming_company, risk_classification);

    const client_accounts = JSON.parse(getStorage('client.accounts'));
    if (isEmptyObject(client_accounts || token_list)) return false;

    const low_risk_no_account = is_low_risk && Object.keys(client_accounts).length > 1;

    const high_risk_no_account = is_high_risk && Object.keys(client_accounts).length > 1;

    const is_high_risk_or_eu = is_eu && is_high_risk;

    return {
        low_risk: is_low_risk,
        high_risk: is_high_risk,
        low_risk_without_account: low_risk_no_account,
        high_risk_without_account: high_risk_no_account,
        high_risk_or_eu: is_high_risk_or_eu,
    };
};
