import { useFetch } from '@deriv/api';
import { useMemo, useState } from 'react';
import useTransferMessageBetweenWalletAndTradingApp from './useTransferMessageBetweenWalletAndTradingApp';

/**
 * Generates and returns the list of all messages to be shown for transfer between accounts.
 * @param from_account - Information of the source account received from the useWalletsList hook.
 * @param to_account - Information of the destination account received from the useWalletsList hook.
 * @param getMessageContent - Function reference to get the content of a message.
 */
const useTransferMessageList = (from_account: any, to_account: any, getMessageContent: any): any => {
    const { data, ...rest } = useFetch('get_limits');
    const account_limits = data?.get_limits;

    const [message_list, setMessageList] = useState<any>([]);

    const between_wallet_and_trading_app = useTransferMessageBetweenWalletAndTradingApp(
        from_account,
        to_account,
        account_limits,
        getMessageContent
    );

    useMemo(() => {
        setMessageList([...between_wallet_and_trading_app]);
    }, [from_account, to_account, account_limits]);

    return { message_list };

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
