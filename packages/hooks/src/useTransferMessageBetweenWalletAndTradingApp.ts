import { useState } from 'react';
import useExchangeRate from './useExchangeRate';

const checkTradingApp = (account_type: string) => {
    const trading_account_types = ['standard', 'trading', 'ctrader', 'derivez', 'dxtrade', 'mt5'];
    return trading_account_types.includes(account_type);
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
    account_limits: any,
    getMessageContent: any
) => {
    const { getRate } = useExchangeRate();
    const message_list = [];
    let limits;

    // need to do limit exchange
    if (from_account && to_account) {
        if (from_account.account_type === 'wallet' && checkTradingApp(to_account.account_type)) {
            limits = account_limits?.daily_transfers[to_account.account_type];
            console.log('=> limits', limits);
            return [
                {
                    variant: 'base',
                    id: 69420,
                    message: getMessageContent(
                        limits.available,
                        'USD',
                        'Usd walleT',
                        'Dtrader',
                        parseFloat(limits.available) === parseFloat(limits.allowed)
                    ),
                    type: 'success',
                },
            ];
        }
    }
    return [];
};

export default useTransferMessageBetweenWalletAndTradingApp;
