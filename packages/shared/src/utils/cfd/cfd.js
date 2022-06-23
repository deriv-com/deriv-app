import { CFD_PLATFORMS } from '../platform';

let CFD_text_translated;

// TODO: add swap_free to this file when ready
const CFD_text = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    cfd: 'CFDs',
    synthetic: 'Synthetic',
    synthetic_bvi: 'Synthetic BVI',
    synthetic_svg: 'Synthetic SVG',
    financial: 'Financial',
    financial_bvi: 'Financial BVI',
    financial_fx: 'Financial Labuan',
    financial_v: 'Financial Vanuatu',
    financial_svg: 'Financial SVG',
};

// * mt5_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial" | "financial_stp" | "swap_free"
// *
// sub_account_type financial_stp only happens in "financial" market_type
export const getCFDAccountKey = ({ market_type, sub_account_type, platform, shortcode }) => {
    if (market_type === 'gaming' || market_type === 'synthetic') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'synthetic_svg';
                case 'bvi':
                    return 'synthetic_bvi';
                default:
                    return 'synthetic';
            }
        }
    }
    if (market_type === 'financial') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'financial_svg';
                case 'bvi':
                    return 'financial_bvi';
                case 'labuan':
                    return 'financial_fx';
                case 'vanuatu':
                    return 'financial_v';
                default:
                    return 'financial';
            }
        }
    }
    return undefined;
};

/**
 * Generate the enum for API request.
 *
 * @param {string} category [real, demo]
 * @param {string} type [synthetic, financial, financial_stp]
 * @return {string}
 */
export const getAccountTypeFields = ({ category, type }) => {
    const map_mode = {
        real: {
            synthetic: {
                account_type: 'gaming',
            },
            financial: {
                account_type: 'financial',
                mt5_account_type: 'financial',
            },
            financial_stp: {
                account_type: 'financial',
                mt5_account_type: 'financial_stp',
            },
        },
        demo: {
            synthetic: {
                account_type: 'demo',
            },
            financial: {
                account_type: 'demo',
                mt5_account_type: 'financial',
            },
            financial_stp: {
                account_type: 'demo',
                mt5_account_type: 'financial_stp',
            },
        },
    };

    return map_mode[category][type];
};

export const getCFDAccountDisplay = ({ market_type, sub_account_type, platform, is_eu, shortcode }) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, shortcode });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        cfd_account_key = 'cfd';
    }

    return CFD_text_translated[cfd_account_key]();
};

export const getCFDAccount = ({ market_type, sub_account_type, platform, is_eu }) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        cfd_account_key = 'cfd';
    }

    return CFD_text[cfd_account_key];
};

export const setSharedCFDText = all_shared_CFD_text => {
    CFD_text_translated = all_shared_CFD_text;
};

export const getAccountListKey = (account, platform) => {
    return `${account.platform || platform}.${account.account_type}.${getCFDAccountKey({
        market_type: account.market_type,
        sub_account_type: account.sub_account_type,
        platform,
    })}@${platform === CFD_PLATFORMS.DXTRADE ? account.market_type : account.server}`;
};

export const getCFDPlatformLabel = platform => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'DMT5';
        case CFD_PLATFORMS.DXTRADE:
            return 'Deriv X';
        default:
            return '';
    }
};

export const isLandingCompanyEnabled = ({ landing_companies, platform, type }) => {
    if (platform === CFD_PLATFORMS.MT5) {
        if (type === 'gaming') return !!landing_companies?.mt_gaming_company?.financial;
        if (type === 'financial') return !!landing_companies?.mt_financial_company?.financial;
        if (type === 'financial_stp') return !!landing_companies?.mt_financial_company?.financial_stp;
    } else if (platform === CFD_PLATFORMS.DXTRADE) {
        if (type === 'gaming') return !!landing_companies?.dxtrade_gaming_company?.standard;
        if (type === 'financial') return !!landing_companies?.dxtrade_financial_company?.standard;
    }
    return false;
};
