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
});

export const DBVI_COMPANY_NAMES = {
    bvi: { tnc_url: 'tnc/deriv-(bvi)-ltd.pdf' },
    maltainvest: { tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf' },
    vanuatu: { tnc_url: 'tnc/general-terms.pdf' },
    labuan: { tnc_url: 'tnc/deriv-(fx)-ltd.pdf' },
    svg: { tnc_url: '' },
} as const;

export const JURISDICTION_MARKET_TYPES = {
    FINANCIAL: 'financial',
    DERIVED: 'synthetic',
} as const;
