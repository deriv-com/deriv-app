import { localize } from '@deriv/translations';

export const Jurisdiction = Object.freeze({
    SVG: 'svg',
    BVI: 'bvi',
    VANUATU: 'vanuatu',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
});

export const Platforms = Object.freeze({
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
    DERIVEZ: 'derivez',
});

export const getFormattedJurisdictionCode = (jurisdiction_code: string) => {
    let formatted_label = '';

    switch (jurisdiction_code) {
        case Jurisdiction.SVG:
            formatted_label = localize('SVG');
            break;
        case Jurisdiction.BVI:
            formatted_label = localize('BVI');
            break;
        case Jurisdiction.LABUAN:
            formatted_label = localize('Labuan');
            break;
        case Jurisdiction.VANUATU:
            formatted_label = localize('Vanuatu');
            break;
        case Jurisdiction.MALTA_INVEST:
            formatted_label = localize('Malta');
            break;
        default:
            formatted_label = jurisdiction_code?.toUpperCase();
            break;
    }

    return formatted_label;
};

export const DBVI_COMPANY_NAMES = {
    bvi: { name: 'Deriv (BVI) Ltd', tnc_url: 'tnc/deriv-(bvi)-ltd.pdf' },
    labuan: { name: 'Deriv (FX) Ltd', tnc_url: 'tnc/deriv-(fx)-ltd.pdf' },
    maltainvest: {
        name: 'Deriv Investments (Europe) Limited',
        tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf',
    },
    vanuatu: { name: 'Deriv (V) Ltd', tnc_url: 'tnc/general-terms.pdf' },
} as const;

export const JURISDICTION_MARKET_TYPES = {
    FINANCIAL: 'financial',
    DERIVED: 'derived',
} as const;

export const getFormattedJurisdictionMarketTypes = (jurisdiction_market_type: string) => {
    let formatted_market_type = '';

    switch (jurisdiction_market_type) {
        case JURISDICTION_MARKET_TYPES.DERIVED:
            formatted_market_type = localize('Derived');
            break;
        case JURISDICTION_MARKET_TYPES.FINANCIAL:
            formatted_market_type = localize('Financial');
            break;
        default:
            formatted_market_type = jurisdiction_market_type?.toUpperCase();
            break;
    }
    return formatted_market_type;
};
