import { useFetch, useRequest } from '@deriv/api';
import { useMemo, useState, useEffect } from 'react';
import useTransferMessageBetweenWalletAndTradingApp from './useTransferMessageBetweenWalletAndTradingApp';

/**
 * Generates and returns the list of all messages to be shown for transfer between accounts.
 * @param from_account - Information of the source account received from the useWalletsList hook.
 * @param to_account - Information of the destination account received from the useWalletsList hook.
 * @param getMessageContent - Function reference to get the content of a message.
 */

const useTransferMessageList = (from_account: any, to_account: any) => {
    const account_limits = {
        daily_transfers: {
            ctrader: {
                allowed: '50000.00',
                available: '49500.00',
                minimum: '0.01',
            },
            dtrade: {
                allowed: '10000.00',
                available: '9000.00',
                minimum: '0.01',
            },
            mt5: {
                allowed: '10000.00',
                available: '9000.00',
                minimum: '0.01',
            },
            derivez: {
                allowed: '10000.00',
                available: '9900.00',
                minimum: '0.01',
            },
            dxtrade: {
                allowed: '10000.00',
                available: '9900.00',
                minimum: '0.01',
            },
            virtual: {
                allowed: '10000.00',
                available: '700.00',
                minimum: '0.01',
            },
        },
        unverified_transfers: {
            crypto_to_crypto: {
                allowed: '200.00',
                available: '100:00',
            },
            crypto_to_fiat: {
                allowed: '500.00',
                available: '500:00',
            },
            fiat_to_crypto: {
                allowed: '1000.00',
                available: '950.00',
            },
        },
    };

    const between_wallet_and_trading_app = useTransferMessageBetweenWalletAndTradingApp(
        from_account,
        to_account,
        account_limits
    );

    return { data: [...between_wallet_and_trading_app] };

    /* 
        useTransferMessageBetweenWallets:
            Fiat-Crypto
            Crypto-Fiat
            Crypto-Crypto
            useTransferBetweenWalletsInfo:
                // will get the fees info
    */
};

export default useTransferMessageList;
