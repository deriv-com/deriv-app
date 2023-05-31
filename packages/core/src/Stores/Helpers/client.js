import { localize } from '@deriv/translations';
import { getPropertyValue } from '@deriv/shared';

export const getClientAccountType = loginid => {
    let account_type;
    if (/^VR/.test(loginid)) account_type = 'virtual';
    else if (/^MF/.test(loginid)) account_type = 'financial';
    else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
    return account_type;
};

const TypesMapConfig = (() => {
    let types_map_config;

    const initTypesMap = () => ({
        default: localize('Real'),
        financial: localize('Investment'),
        gaming: localize('Gaming'),
        virtual: localize('Virtual'),
    });

    return {
        get: () => {
            if (!types_map_config) {
                types_map_config = initTypesMap();
            }
            return types_map_config;
        },
    };
})();

export const getAccountTitle = loginid => {
    const types_map = TypesMapConfig.get();
    return types_map[getClientAccountType(loginid)] || types_map.default;
};

export const getAvailableAccount = market_type => {
    if (market_type === 'all') {
        return 'all';
    }
    return 'financial';
};

export const getLandingCompanyValue = ({ loginid, landing_company, isAccountOfType }) => {
    const key = 'changeable_fields';
    let landing_company_object;

    if (loginid.financial || isAccountOfType('financial')) {
        landing_company_object = getPropertyValue(landing_company, 'financial_company');
    } else if (loginid.real || isAccountOfType('real')) {
        landing_company_object = getPropertyValue(landing_company, 'gaming_company');

        // handle accounts that don't have gaming company
        if (!landing_company_object) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        }
    } else {
        const financial_company = (getPropertyValue(landing_company, 'financial_company') || {})[key] || [];
        const gaming_company = (getPropertyValue(landing_company, 'gaming_company') || {})[key] || [];
        landing_company_object = financial_company.concat(gaming_company);
        return landing_company_object;
    }
    return (landing_company_object || {})[key];
};

export const getMultipliersAccountStatus = authentication => {
    const onfido_status = authentication?.identity?.services?.onfido?.status;
    const manual_status = authentication?.identity?.services?.manual?.status;
    const poa_status = authentication?.document?.status;

    const STATUS = {
        NONE: 'none',
        VERIFIED: 'verified',
        PENDING: 'pending',
        REJECTED: 'rejected',
        EXPIRED: 'expired',
        SUSPECTED: 'suspected',
    };
    const failed_cases = [STATUS.REJECTED, STATUS.EXPIRED, STATUS.SUSPECTED];

    const need_poa_resubmission = failed_cases.includes(poa_status);
    const poa_pending = poa_status === STATUS.PENDING;
    const poa_not_submitted = poa_status === STATUS.NONE;

    const poi_verified_by_onfido_or_manual = [onfido_status, manual_status].includes(STATUS.VERIFIED);
    const poi_pending_by_onfido_or_manual =
        onfido_status &&
        manual_status &&
        [onfido_status, manual_status].includes(STATUS.PENDING) &&
        !poi_verified_by_onfido_or_manual;

    const poi_not_submitted_by_onfido_or_manual =
        onfido_status && manual_status && [onfido_status, manual_status].every(status => status === STATUS.NONE);

    const need_poi_resubmission_by_onfido_or_manual =
        !poi_pending_by_onfido_or_manual && !poi_not_submitted_by_onfido_or_manual && !poi_verified_by_onfido_or_manual;

    if (poi_not_submitted_by_onfido_or_manual || poa_not_submitted) {
        return 'need_verification';
    } else if (need_poi_resubmission_by_onfido_or_manual || need_poa_resubmission) {
        return 'failed';
    } else if (poi_pending_by_onfido_or_manual || poa_pending) {
        return 'pending';
    }
    return null;
};
