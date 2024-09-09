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
    bvi: {
        name: 'Deriv (BVI) Ltd',
        tnc_url: 'tnc/deriv-(bvi)-ltd.pdf',
        licence_name: 'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)',
    },
    maltainvest: {
        name: 'Deriv Investments (Europe) Limited',
        tnc_url: 'tnc/deriv-investments-(europe)-limited.pdf',
        licence_name: `Malta Financial Services Authority (MFSA) (licence no. IS/70156)`,
    },
    vanuatu: {
        name: 'Deriv (V) Ltd',
        tnc_url: 'tnc/general-terms.pdf',
        licence_name: `Vanuatu Financial Services Commission`,
    },
    svg: { name: 'Deriv (SVG) LLC', tnc_url: '', licence_name: `Deriv (SVG) LLC (company no. 273 LLC 2020)` },
} as const;

export const JURISDICTION_MARKET_TYPES = {
    FINANCIAL: 'financial',
    DERIVED: 'synthetic',
} as const;
