let DXTrade_text_translated;

const DXTrade_text = {
    dxtrade: 'DXTrade',
    synthetic: 'Synthetic',
    financial: 'Financial',
};

// * dxtrade_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial"
// *
export const getDXTradeAccountKey = (market_type, sub_account_type) => {
    if (market_type === 'gaming') {
        if (sub_account_type === 'financial') {
            return 'synthetic';
        }
    }
    if (market_type === 'financial') {
        if (sub_account_type === 'financial') {
            return 'financial';
        }
    }
    return undefined;
};

/**
 * Generate the enum for API request.
 *
 * @param {string} category [real, demo]
 * @param {string} type [synthetic, financial]
 * @return {string}
 */
export const getDXTradeAccountTypeFields = ({ category, type }) => {
    const map_mode = {
        real: {
            synthetic: {
                account_type: 'gaming',
            },
            financial: {
                account_type: 'financial',
                dxtrade_account_type: 'financial',
            },
        },
        demo: {
            synthetic: {
                account_type: 'demo',
            },
            financial: {
                account_type: 'demo',
                dxtrade_account_type: 'financial',
            },
        },
    };

    return map_mode[category][type];
};

export const getDXTradeAccountDisplay = (market_type, sub_account_type) => {
    const dxtrade_account_key = getDXTradeAccountKey(market_type, sub_account_type);
    if (!dxtrade_account_key) return undefined;

    return DXTrade_text_translated[dxtrade_account_key]();
};

export const getDXTradeAccount = (market_type, sub_account_type) => {
    const dxtrade_account_key = getDXTradeAccountKey(market_type, sub_account_type);
    if (!dxtrade_account_key) return undefined;

    console.log(DXTrade_text[dxtrade_account_key]);
    return DXTrade_text[dxtrade_account_key];
};

export const setSharedDXTradeText = all_shared_dxtrade_text => {
    DXTrade_text_translated = all_shared_dxtrade_text;
};

export const getDXTradeAccountListKey = account =>
    `${account.account_type}.${getDXTradeAccountKey(account.market_type, account.sub_account_type)}@${account.server}`;
