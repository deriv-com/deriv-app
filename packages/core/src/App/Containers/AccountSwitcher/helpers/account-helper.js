export const getSortedAccountList = (account_list, accounts) => {
    // sort accounts as follows:
    // highest balance first, then demo accounts last
    return [...account_list].sort((a, b) => {
        // Always put virtual (demo) accounts last
        if (a.is_virtual || b.is_virtual) {
            return a.is_virtual ? 1 : -1;
        }

        // For non-virtual accounts, sort by balance (highest first)
        const a_balance = parseFloat(accounts[a.loginid].balance);
        const b_balance = parseFloat(accounts[b.loginid].balance);

        // Sort in descending order (higher balance first)
        return b_balance - a_balance;
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
