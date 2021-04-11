let MT5_text_translated;

// TODO: add swap_free to this file when ready
const MT5_text = {
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
export const getMT5AccountKey = (market_type, sub_account_type) => {
    if (market_type === 'gaming') {
        if (sub_account_type === 'financial') {
            return 'synthetic';
        }
    }
    if (market_type === 'financial') {
        if (sub_account_type === 'financial') {
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

export const getMT5AccountDisplay = (market_type, sub_account_type) => {
    const mt5_account_key = getMT5AccountKey(market_type, sub_account_type);
    if (!mt5_account_key) return undefined;

    return MT5_text_translated[mt5_account_key]();
};

export const getMT5Account = (market_type, sub_account_type) => {
    const mt5_account_key = getMT5AccountKey(market_type, sub_account_type);
    if (!mt5_account_key) return undefined;

    return MT5_text[mt5_account_key];
};

export const setSharedMT5Text = all_shared_mt5_text => {
    MT5_text_translated = all_shared_mt5_text;
};

export const getMT5AccountListKey = account =>
    `${account.account_type}.${getMT5AccountKey(account.market_type, account.sub_account_type)}@${account.server}`;
