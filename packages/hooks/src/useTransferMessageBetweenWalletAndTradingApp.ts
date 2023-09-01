import { useState } from 'react';

import useExchangeRate from './useExchangeRate';

const checkIsTradingAccount = (account_type: string) => {
    const trading_account_types = ['ctrader', 'derivez', 'dxtrade', 'mt5', 'trading'];
    return trading_account_types.includes(account_type);
};

const trading_account_mapper = (category: string, type: string): string => {
    if (category === 'fiat')
        switch (type) {
            case 'trading':
                return 'dtrade';
            default:
                return type;
        }
    return 'virtual';
};

/*
    This hook handles messages for:
    RealWallet-TradingApp
    TradingApp-RealWallet
    DemoWallet-DemoTradingApp
    DemoTradingApp-DemoWallet
*/
const useTransferMessageBetweenWalletAndTradingApp = (
    from_account: any,
    to_account: any,
    account_limits: any
): Array<any> => {
    let message_list: Array<any> = [];

    const { getRate } = useExchangeRate();

    if (from_account && to_account)
        if (from_account.account_type === 'wallet' && checkIsTradingAccount(to_account.account_type)) {
            const limits =
                account_limits.daily_transfers[trading_account_mapper(to_account.type, to_account.account_type)];
            console.log('=> type to_account', parseFloat(limits.available), to_account.type);

            message_list.push({
                code:
                    from_account.demo_account === 0
                        ? 'WalletToTradingAppDailyLimit'
                        : 'DemoWalletToTradingAppDailyLimit',
                mt5_market_type: to_account.mt5_market_type,
                is_first_transfer: parseFloat(limits?.allowed) !== parseFloat(limits?.available),
                limit: !from_account.demo_account
                    ? parseFloat(limits?.available) * getRate(from_account.currency)
                    : parseFloat(limits?.available),
                currency: from_account.currency,
                type: 'success',
            });
        }

    return message_list;
};

export default useTransferMessageBetweenWalletAndTradingApp;
