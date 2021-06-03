import { CFD_PLATFORMS } from '../platform';

let CFD_text_translated;

// TODO: add swap_free to this file when ready
const CFD_text = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    synthetic: 'Synthetic',
    financial: 'Financial',
    financial_stp: 'Financial STP',
};

// * mt5_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial" | "financial_stp" | "swap_free"
// *
// sub_account_type financial_stp only happens in "financial" market_type
export const getCFDAccountKey = ({ market_type, sub_account_type, platform }) => {
    if (market_type === 'gaming' || market_type === 'synthetic') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            return 'synthetic';
        }
    }
    if (market_type === 'financial') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            return 'financial';
        }
        if (sub_account_type === 'financial_stp') {
            return 'financial_stp';
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

export const getCFDAccountDisplay = ({ market_type, sub_account_type, platform }) => {
    const cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform });
    if (!cfd_account_key) return undefined;

    return CFD_text_translated[cfd_account_key]();
};

export const getCFDAccount = ({ market_type, sub_account_type, platform }) => {
    const cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform });
    if (!cfd_account_key) return undefined;

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
