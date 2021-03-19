import { isCryptocurrency, getMT5AccountKey, getMT5Account, getMT5AccountDisplay } from '@deriv/shared';

export const getSortedAccountList = (account_list, accounts) => {
    // sort accounts as follows:
    // top is fiat, then crypto (each alphabetically by currency), then demo
    return account_list.slice().sort((a, b) => {
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

export const getSortedCFDList = (mt5_login_list, platform = 'mt5') => {
    // for DXTrade, MT5, synthetic, financial, financial stp
    if (platform === 'dxtrade') return {};
    return mt5_login_list.slice().sort((a, b) => {
        const a_is_demo = isDemo(a);
        const b_is_demo = isDemo(b);

        if (a_is_demo && !b_is_demo) {
            return 1;
        }
        if (b_is_demo && !a_is_demo) {
            return -1;
        }
        if (a.market_type === 'gaming') {
            return -1;
        }
        if (a.sub_account_type === 'financial') {
            return b.market_type === 'gaming' ? 1 : -1;
        }
        return 1;
    });
};

export const isDemo = account => account.account_type === 'demo';

export const getMtConfig = (market_type, landing_company, existing_mt5_accounts, trading_servers, platform) => {
    const mt5_config = [];
    if (landing_company) {
        Object.keys(landing_company).forEach(company => {
            if (company === 'financial_stp' && platform === 'dxtrade') return;

            let has_account = existing_mt5_accounts.find(
                account => account.sub_account_type === company && account.market_type === market_type
            );
            if (has_account) {
                const number_market_type_available = trading_servers.filter(
                    s => s.supported_accounts.includes(market_type) && !s.disabled
                ).length;
                if (number_market_type_available && has_account.account_type === 'real') {
                    has_account = false;
                }
            }

            if (!has_account) {
                const type = getMT5AccountKey(market_type, company);
                if (type) {
                    mt5_config.push({
                        icon: getMT5Account(market_type, company),
                        title: getMT5AccountDisplay(market_type, company),
                        type,
                    });
                }
            }
        });
    }
    return mt5_config;
};
