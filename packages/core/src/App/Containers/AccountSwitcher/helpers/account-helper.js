import { isCryptocurrency, getCFDAccountKey, getCFDAccount, getCFDAccountDisplay, CFD_PLATFORMS } from '@deriv/shared';

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

export const getCFDConfig = (
    market_type,
    landing_company,
    existing_cfd_accounts,
    mt5_trading_servers,
    platform,
    is_eu,
    trading_platform_available_accounts,
    getIsEligibleForMoreAccounts
) => {
    const cfd_config = [];

    if (landing_company) {
        Object.keys(landing_company).forEach(company => {
            let has_account = existing_cfd_accounts.find(account => {
                const account_market_type = account.market_type === 'synthetic' ? 'gaming' : account.market_type;
                if (platform === CFD_PLATFORMS.DXTRADE) {
                    return account_market_type === market_type;
                }
                return account.sub_account_type === company && account_market_type === market_type;
            });
            if (has_account && platform === CFD_PLATFORMS.MT5 && is_eu) {
                const number_market_type_available = mt5_trading_servers.filter(s => {
                    const server_market_type = s.market_type === 'synthetic' ? 'gaming' : s.market_type;
                    return market_type === server_market_type && !s.disabled;
                }).length;
                if (number_market_type_available && has_account.account_type === 'real') {
                    has_account = false;
                }
            }
            if (!has_account && (is_eu || platform === CFD_PLATFORMS.DXTRADE)) {
                const type = getCFDAccountKey({ market_type, sub_account_type: company, platform });
                if (type) {
                    cfd_config.push({
                        icon: getCFDAccount({ market_type, sub_account_type: company, platform, is_eu }),
                        title: getCFDAccountDisplay({
                            market_type,
                            sub_account_type: company,
                            platform,
                            is_eu,
                        }),
                        type,
                    });
                }
            }
        });
    }
    if (!is_eu && platform === CFD_PLATFORMS.MT5) {
        // show remaining Synthetic and/or Financial while a client can still open more real accounts or more demo svg
        ['synthetic', 'financial'].forEach(account_type => {
            if ((account_type === 'synthetic' ? 'gaming' : 'financial') === market_type) {
                if (getIsEligibleForMoreAccounts(account_type)) {
                    cfd_config.push({
                        icon: getCFDAccount({ market_type, sub_account_type: 'financial', platform, is_eu }),
                        title: getCFDAccountDisplay({
                            market_type,
                            sub_account_type: 'financial',
                            platform,
                            is_eu,
                        }),
                        type: account_type,
                    });
                }
            }
        });
    }

    return cfd_config;
};
