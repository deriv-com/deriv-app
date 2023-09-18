import { useEffect } from 'react';
import useExchangeRate from './useExchangeRate';
import useWalletTransfer from './useWalletTransfer';

type TTransferMessageListBetweenWalletAndTradingApp =
    | {
          code: 'WalletAndTradingAppDailyLimit';
          is_first_transfer: boolean;
          limit: number;
          currency: string;
          type: 'error' | 'info' | 'success';
      }
    | {
          code: 'DemoWalletAndTradingAppDailyLimit';
          is_first_transfer: boolean;
          limit: number;
          currency: string;
          type: 'error' | 'info' | 'success';
      };

const tradingAccountMapper = (account_type: string, currency_type: string): string => {
    if (account_type === 'trading') {
        if (currency_type === 'demo') return 'virtual';
        return 'dtrade';
    }
    return account_type;
};

/**
 * Generates and returns the list of all messages to be shown for transfer between wallets and trading accounts linked to it.
 * @param from_account - Information of the source account received from the useWalletsList hook.
 * @param to_account - Information of the destination account received from the useWalletsList hook.
 */
const useTransferMessageListBetweenWalletAndTradingApp = (
    from_account: Partial<ReturnType<typeof useWalletTransfer>['from_account']>,
    to_account: Partial<ReturnType<typeof useWalletTransfer>['to_account']>,
    account_limits: any // TODO: add type of account_limits when the new schema is ready.
) => {
    /*
        TODO: Need to handle messages for the following scenarios:
                TradingApp-RealWallet
                DemoTradingApp-DemoWallet
    */

    const message_list: TTransferMessageListBetweenWalletAndTradingApp[] = [];

    const { getRate } = useExchangeRate();

    if (from_account && to_account) {
        let limits;
        if (from_account.account_type === 'wallet' && to_account.account_type !== 'wallet') {
            if (to_account.account_type && to_account.type) {
                limits = account_limits.daily_transfers[tradingAccountMapper(to_account.account_type, to_account.type)];
            }
            if (from_account.currency) {
                if (from_account.is_demo) {
                    message_list.push({
                        code: 'DemoWalletAndTradingAppDailyLimit',
                        is_first_transfer: parseFloat(limits?.allowed) === parseFloat(limits?.available),
                        limit: parseFloat(limits?.available),
                        currency: from_account.currency,
                        type: 'success',
                    });
                } else {
                    message_list.push({
                        code: 'WalletAndTradingAppDailyLimit',
                        is_first_transfer: parseFloat(limits?.allowed) === parseFloat(limits?.available),
                        limit: parseFloat(limits?.available) * getRate(from_account.currency),
                        currency: from_account.currency,
                        type: 'success',
                    });
                }
            }
        }
        if (from_account.account_type !== 'wallet' && to_account.account_type === 'wallet') {
            if (from_account.account_type && from_account.type) {
                limits =
                    account_limits.daily_transfers[tradingAccountMapper(from_account.account_type, from_account.type)];
            }
            if (from_account.currency) {
                if (from_account.is_demo) {
                    message_list.push({
                        code: 'DemoWalletAndTradingAppDailyLimit',
                        is_first_transfer: parseFloat(limits?.allowed) === parseFloat(limits?.available),
                        limit: parseFloat(limits?.available),
                        currency: from_account.currency,
                        type: 'success',
                    });
                } else {
                    message_list.push({
                        code: 'WalletAndTradingAppDailyLimit',
                        is_first_transfer: parseFloat(limits?.allowed) === parseFloat(limits?.available),
                        limit: parseFloat(limits?.available) * getRate(from_account.currency),
                        currency: from_account.currency,
                        type: 'success',
                    });
                }
            }
        }
        document.getElementById(
            'mock-limit-values'
        ).innerHTML = `Allowed = ${limits?.allowed}<br>Available = ${limits?.available}`;
    }
    return message_list;
};

export default useTransferMessageListBetweenWalletAndTradingApp;
