import { localize } from '@deriv/translations';

/**
 * Experian result is defined by client's information validity.
 * Defines the possible types of actions needed to take on experian result response.
 *
 * Possible values are:
 *   - Success: Client can trade
 *   - Warn: POI/POA Validity partially failed, trade in demo possible
 *   - Danger: POI/POA validation failed. Trade is locked until this resolved.
 *   - Pending: POI/POA is in pending state.
 * @enum {EXPERIAN}
 */
export const EXPERIAN = {
    SUCCESS: 1,
    WARN: 0,
    DANGER: -1,
    PENDING: -2,
};

/**
 * Return account title for the given landing company
 * - Example:
 * getAccountTitle('malta') => 'Real Derived'
 *
 * @param {string} landing_company_shortcode
 * @param {object} options
 * @return {string} localized title
 */
export const getAccountTitle = (landing_company_shortcode, { account_residence = '' } = {}, country_standpoint) => {
    // TODO: [deriv-eu] merge if statement and switch together once more residence cases are found.
    if (account_residence === 'im') {
        return localize('Deriv account');
    }

    switch (landing_company_shortcode) {
        case 'svg':
            return localize('Deriv account');
        case 'iom':
            if (country_standpoint.is_united_kingdom) {
                return localize('Deriv Gaming');
            }
            return localize('Derived');
        case 'malta':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_rest_of_eu ||
                country_standpoint.is_belgium
            ) {
                return localize('Options');
            }
            return localize('Derived');
        case 'maltainvest':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_france ||
                country_standpoint.is_other_eu ||
                country_standpoint.is_rest_of_eu
            ) {
                return localize('Multipliers');
            }
            return localize('Deriv Financial');
        default:
            return localize('Deriv');
    }
};

/**
 * @param {string} landing_company_shortcode
 * @param {boolean} is_fully_authenticated
 * @param {boolean} is_age_verified
 * @param {boolean} is_isle_of_man_residence
 * @param {boolean} is_belgium_residence,
 *
 * @return {EXPERIAN.WARN|EXPERIAN.SUCCESS|EXPERIAN.DANGER}
 */
export const getExperianResult = status => {
    const {
        landing_company_shortcode = '',
        is_fully_authenticated = false,
        is_age_verified = false,
        is_isle_of_man_residence = false,
        is_belgium_residence = false,
    } = status;
    const getIOMStatus = () => {
        if (is_fully_authenticated) return EXPERIAN.SUCCESS;
        if (is_age_verified) return EXPERIAN.WARN;

        return EXPERIAN.DANGER;
    };

    if (landing_company_shortcode === 'svg' || is_isle_of_man_residence || is_belgium_residence)
        return EXPERIAN.SUCCESS;
    if (landing_company_shortcode === 'iom') return getIOMStatus({ is_fully_authenticated, is_age_verified });

    return EXPERIAN.SUCCESS;
};

export const screen_height_sm_threshold = 930;
