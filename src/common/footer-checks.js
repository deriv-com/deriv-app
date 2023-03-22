/* eslint-disable import/prefer-default-export */
import api from '../botPage/view/deriv/api';

import { get as getStorage } from '../common/utils/storageManager';
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
export const checkSwitcherType = async () => {
    const is_eu_landing = await isEuLandingCompany();
    const is_eu = await isEuCountry();
    const { website_status } = await api.send({ website_status: 1 });
    const { clients_country } = website_status;
    const { landing_company } = await api.send({ landing_company: clients_country });
    const { financial_company, gaming_company } = landing_company;

    const client_accounts = JSON.parse(getStorage('client.accounts'));
    if (isEmptyObject(client_accounts)) return false;

    const low_risk_landing_company =
        financial_company?.shortcode === 'maltainvest' && gaming_company?.shortcode === 'svg';
    const low_risk_account = is_eu_landing && low_risk_landing_company;

    const low_risk_no_account = low_risk_account && Object.keys(client_accounts).length > 1;

    const restricted_countries =
        financial_company?.shortcode === 'svg' ||
        (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

    const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
    const high_risk_account =
        high_risk_landing_company || client_accounts?.risk_classification === 'high' || restricted_countries;

    const high_risk_no_account = high_risk_account && Object.keys(client_accounts).length === 1;

    const is_high_risk_or_eu = is_eu && high_risk_account;

    return {
        low_risk: low_risk_account,
        low_risk_without_account: low_risk_no_account,
        high_risk: high_risk_account,
        high_risk_without_account: high_risk_no_account,
        high_risk_or_eu: is_high_risk_or_eu,
    };
};
