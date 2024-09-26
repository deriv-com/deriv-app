import { isCryptocurrency } from '@deriv/shared';

export const getSortedAccountList = (account_list, accounts) => {
    // sort accounts as follows:
    // top is fiat, then crypto (each alphabetically by currency), then demo
    return [...account_list].sort((a, b) => {
        const a_currency = accounts[a.loginid].currency;
        const b_currency = accounts[b.loginid].currency;
        const a_is_crypto = isCryptocurrency(a_currency);
        const b_is_crypto = isCryptocurrency(b_currency);
        const a_is_fiat = !a_is_crypto;
        const b_is_fiat = !b_is_crypto;
        if (a.is_virtual || b.is_virtual) {
            return a.is_virtual ? 1 : -1;
        } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
            return a_currency < b_currency ? -1 : 1;
        } else if (a_is_fiat && b_is_crypto) {
            return -1;
        }
        return 1;
    });
};

export const getSortedCFDList = account_list => {
    // for DXTrade, MT5, synthetic, financial, financial stp
    return [...account_list].sort((a, b) => {
        const a_is_demo = isDemo(a);
        const b_is_demo = isDemo(b);

        if (a_is_demo && !b_is_demo) {
            return 1;
        }
        if (b_is_demo && !a_is_demo) {
            return -1;
        }
        if (a.market_type === 'gaming' || a.market_type === 'synthetic') {
            return -1;
        }
        if (a.sub_account_type === 'financial') {
            return b.market_type === 'gaming' || b.market_type === 'synthetic' ? 1 : -1;
        }
        return 1;
    });
};

export const isDemo = account => account.account_type === 'demo';
