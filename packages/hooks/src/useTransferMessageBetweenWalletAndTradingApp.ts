import useExchangeRate from './useExchangeRate';
import useWalletTransfer from './useWalletTransfer';

type TTransferMessageReturnType = {
    code: 'WalletToTradingAppDailyLimit' | 'DemoWalletToTradingAppDailyLimit';
    cta?: string;
    is_first_transfer: boolean;
    limit?: number;
    currency?: string;
    type: 'error' | 'info' | 'success';
};

const checkIsTradingAccount = (account_type = '') => {
    if (account_type) {
        const trading_account_types = ['ctrader', 'derivez', 'dxtrade', 'mt5', 'trading'];
        return trading_account_types.includes(account_type);
    }
};

const tradingAccountMapper = (account_type: string, currency_type: string): string => {
    if (account_type === 'trading')
        if (currency_type === 'demo') return 'virtual';
        else return 'dtrade';
    return account_type;
};

/**
 * Generates and returns the list of all messages to be shown for transfer between wallets and trading accounts linked to it.
 * @param from_account - Information of the source account received from the useWalletsList hook.
 * @param to_account - Information of the destination account received from the useWalletsList hook.
 */
const useTransferMessageBetweenWalletAndTradingApp = (
    from_account: ReturnType<typeof useWalletTransfer>['from_account'],
    to_account: ReturnType<typeof useWalletTransfer>['to_account'],
    account_limits: any // TODO: add type of account_limits when the new schema is ready.
): Array<TTransferMessageReturnType> => {
    /*
        TODO: Need to handle messages for the following scenarios:
                TradingApp-RealWallet
                DemoTradingApp-DemoWallet
    */

    const message_list: Array<TTransferMessageReturnType> = [];

    const { getRate } = useExchangeRate();

    if (from_account && to_account)
        if (from_account.account_type === 'wallet' && checkIsTradingAccount(to_account.account_type)) {
            let limits;
            if (to_account.account_type)
                limits = account_limits.daily_transfers[tradingAccountMapper(to_account.account_type, to_account.type)];
            if (from_account.currency)
                message_list.push({
                    code: !from_account.is_demo ? 'WalletToTradingAppDailyLimit' : 'DemoWalletToTradingAppDailyLimit',
                    is_first_transfer: parseFloat(limits?.allowed) === parseFloat(limits?.available),
                    limit: !from_account.is_demo
                        ? parseFloat(limits?.available) * getRate(from_account.currency)
                        : parseFloat(limits?.available),
                    currency: from_account.currency,
                    type: 'success',
                });
        }

    return message_list;
};

export default useTransferMessageBetweenWalletAndTradingApp;
