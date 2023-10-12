import { useMemo } from 'react';
import useActiveWalletAccount from './useActiveWalletAccount';
import useQuery from '../useQuery';
import { TSocketResponseData } from '../../types';
import { UseQueryResult } from '@tanstack/react-query';

type TMT5Migration = {
    eligible_to_migrate?: Record<string, string>;
    open_order_position_status?: number;
};

/** A custom hook that gets the list created MT5 accounts of the user. */
const useMT5AccountsList = () => {
    const { data: wallet } = useActiveWalletAccount();

    type demo = DeepRequired<NonNullable<ReturnType<typeof useQuery<'mt5_login_list'>>['data']>>['mt5_login_list'][0] &
        TMT5Migration;

    // const { data: mt5_accounts, ...mt5_accounts_rest } = useQuery('mt5_login_list');
    const result = useQuery('mt5_login_list');
    type x = typeof result;

    type OmitA = Omit<x, 'data'>; // Equivalent to: {b: number, c: boolean}

    /**
     * @description The list of created MT5 accounts
     */
    const modified_mt5_accounts = useMemo(() => {
        /** Adding the neccesary properties to the response */
        const getAccountInfo = (login?: string) => {
            return {
                /** The platform of the account linked to the wallet */
                platform: wallet?.linked_to?.find(linked => linked.loginid === login)?.platform,
                /** The formatted display login of the account */
                display_login: login?.replace(/^(MT[DR]?)/, ''),
            };
        };

        return mt5_accounts?.mt5_login_list?.map(account => ({
            ...account,
            ...getAccountInfo(account.login),
            /** The id of the account */
            loginid: account.login,
            /** The platform of the account */
            platform: 'mt5',
        }));
    }, [mt5_accounts?.mt5_login_list, wallet?.linked_to]);

    return {
        /** The list of created MT5 accounts */
        data: modified_mt5_accounts,
        ...mt5_accounts_rest,
    };
};

export default useMT5AccountsList;
