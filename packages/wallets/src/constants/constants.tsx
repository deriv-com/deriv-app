import { useTranslations } from '@deriv-com/translations';
import { getStaticUrl, getUrlSmartTrader } from '../helpers/urls';

type TOptionsAndMultipliersContent = {
    availability: 'All' | 'EU' | 'Non-EU';
    description: string;
    isExternal?: boolean;
    key: string;
    redirect: string;
    title: string;
};

/**
 * Appends current URL search parameters to a given URL
 * @param url - The base URL to append parameters to
 * @returns The URL with search parameters appended
 */
export const appendSearchParamsToUrl = (url: string): string => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.toString()) {
        return `${url}?${searchParams.toString()}`;
    }
    return url;
};

export const getOptionsAndMultipliersContent = (
    localize: ReturnType<typeof useTranslations>['localize'],
    isEU?: boolean
): TOptionsAndMultipliersContent[] => [
    {
        availability: 'All',
        description: isEU
            ? localize('Custom charts, low-entry costs.')
            : localize('The options and multipliers trading platform.'),
        key: 'trader',
        redirect: '/dtrader',
        title: 'Deriv Trader',
    },
    {
        availability: 'Non-EU',
        description: localize('The ultimate bot trading platform.'),
        isExternal: true,
        key: 'bot',
        redirect: appendSearchParamsToUrl('/bot'),
        title: 'Deriv Bot',
    },
    {
        availability: 'Non-EU',
        description: localize('The legacy options trading platform.'),
        isExternal: true,
        key: 'smarttrader',
        redirect: appendSearchParamsToUrl(getUrlSmartTrader()),
        title: 'SmartTrader',
    },
    {
        availability: 'Non-EU',
        description: localize('The mobile app for trading multipliers and accumulators.'),
        isExternal: true,
        key: 'derivgo',
        redirect: getStaticUrl('/deriv-go'),
        title: 'Deriv GO',
    },
];

export const ACCOUNT_VERIFICATION_STATUSES = {
    EXPIRED: 'expired',
    NONE: 'none',
    PENDING: 'pending',
    REJECTED: 'rejected',
    SUSPECTED: 'suspected',
    VERIFIED: 'verified',
} as const;

export const ACCOUNT_VERIFICATION_BADGE_STATUS = {
    FAILED: 'failed',
    IN_REVIEW: 'in_review',
    NEEDS_VERIFICATION: 'needs_verification',
} as const;

export const LANDING_COMPANIES = Object.freeze({
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
});
