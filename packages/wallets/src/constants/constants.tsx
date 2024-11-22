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
        key: 'bot',
        redirect: '/bot',
        title: 'Deriv Bot',
    },
    {
        availability: 'Non-EU',
        description: localize('The legacy options trading platform.'),
        isExternal: true,
        key: 'smarttrader',
        redirect: getUrlSmartTrader(),
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

export const LANDING_COMPANIES = Object.freeze({
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
});
