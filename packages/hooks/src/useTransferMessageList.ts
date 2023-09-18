import { useEffect, useState } from 'react';
import useTransferMessageListBetweenWalletAndTradingApp from './useTransferMessageListBetweenWalletAndTradingApp';
import useWalletTransfer from './useWalletTransfer';

/**
 * Returns the list of all the messages to be shown for transfer between accounts.
 * @param from_account - Information of the source account received from the useWalletsList hook.
 * @param to_account - Information of the destination account received from the useWalletsList hook.
 */

const useTransferMessageList = (
    from_account: Partial<ReturnType<typeof useWalletTransfer>['from_account']>,
    to_account: Partial<ReturnType<typeof useWalletTransfer>['to_account']>,
    is_limits_equal: boolean
) => {
    // TODO: fetch the new get_limits call here and return its response new schema is available.
    const [account_limits, setAccountLimits] = useState(mock_equal_get_limits_response);

    useEffect(() => {
        setAccountLimits(is_limits_equal ? mock_equal_get_limits_response : mock_unequal_get_limits_response);
    }, [is_limits_equal]);

    const between_wallet_and_trading_app = useTransferMessageListBetweenWalletAndTradingApp(
        from_account,
        to_account,
        account_limits
    );

    return { data: [...between_wallet_and_trading_app] };
};

const mock_equal_get_limits_response = {
    daily_transfers: {
        ctrader: {
            allowed: '50000.00',
            available: '50000.00',
            minimum: '0.01',
        },
        dtrade: {
            allowed: '10000.00',
            available: '10000.00',
            minimum: '0.01',
        },
        mt5: {
            allowed: '10000.00',
            available: '10000.00',
            minimum: '0.01',
        },
        derivez: {
            allowed: '200.00',
            available: '200.00',
            minimum: '0.01',
        },
        dxtrade: {
            allowed: '2000.00',
            available: '2000.00',
            minimum: '0.01',
        },
        virtual: {
            allowed: '10000.00',
            available: '10000.00',
            minimum: '0.01',
        },
    },
    unverified_transfers: {
        crypto_to_crypto: {
            allowed: '200.00',
            available: '200:00',
        },
        crypto_to_fiat: {
            allowed: '500.00',
            available: '500:00',
        },
        fiat_to_crypto: {
            allowed: '1000.00',
            available: '1000.00',
        },
    },
};

const mock_unequal_get_limits_response = {
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
            available: '10000.00',
            minimum: '0.01',
        },
        derivez: {
            allowed: '200.00',
            available: '200.00',
            minimum: '0.01',
        },
        dxtrade: {
            allowed: '2000.00',
            available: '1900.00',
            minimum: '0.01',
        },
        virtual: {
            allowed: '10000.00',
            available: '10000.00',
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

export default useTransferMessageList;
