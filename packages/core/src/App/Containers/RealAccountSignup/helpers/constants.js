import { localize } from '@deriv/translations';

/**
 * Experian result is defined by client's information validity.
 * Defines the possible types of actions needed to take on experian result response
 * Possible values are:
 *   - Success: Client can trade
 *   - Warn: POI/POA Validity partially failed, trade in demo possible
 *   - Danger: POI/POA validation failed. Trade is locked until this resolved.
 *
 * @enum {EXPERIAN}
 */
export const EXPERIAN = {
    SUCCESS: 1,
    WARN: 0,
    DANGER: -1,
};

/**
 * Return account title for the given landing company
 * - Example:
 * getAccountTitle('malta') => 'Real Gaming'
 *
 * @param {string} short_code - Landing company shortcode
 * @return {string} localized title
 */
export const getAccountTitle = short_code => {
    switch (short_code) {
        case 'svg':
            return localize('Real');
        case 'iom':
        case 'malta':
            return localize('Real Gaming');
        case 'maltainvest':
            return localize('Real Financial');
        default:
            return localize('Deriv');
    }
};

/**
 *
 * @param {string} landing_company_shortcode
 * @param {boolean} is_fully_authenticated
 * @param {boolean} is_age_verified
 *
 * @return {EXPERIAN.WARN|EXPERIAN.SUCCESS|EXPERIAN.DANGER}
 */
export const getExperianResult = ({ landing_company_shortcode, is_fully_authenticated, is_age_verified }) => {
    const getIOMStatus = () => {
        if (is_fully_authenticated) return EXPERIAN.SUCCESS;
        if (is_age_verified) return EXPERIAN.WARN;
        return EXPERIAN.DANGER;
    };

    if (landing_company_shortcode === 'svg') return EXPERIAN.SUCCESS;
    if (landing_company_shortcode === 'iom') return getIOMStatus({ is_fully_authenticated, is_age_verified });

    return EXPERIAN.SUCCESS;
};
