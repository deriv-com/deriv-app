import { useActiveAccount, useCurrencyConfig, useTransferBetweenAccounts } from '@deriv/api';

const useExtendedTransferBetweenAccounts = () => {
    const { data: ActiveAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { data: transferBetweenAccounts, isSuccess: isTransferBetweenAccountsSuccess } = useTransferBetweenAccounts();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = isActiveAccountLoading || isCurrencyConfigLoading || isTransferBetweenAccountsSuccess;

    const modifiedTransferableAccounts = () => {
        if (!isLoading || !transferBetweenAccounts || !transferBetweenAccounts.accounts) return [];

        return transferBetweenAccounts.accounts.map(account => ({
            ...account,
            currencyConfig: getConfig(account.currency),
        }));
    };

    return {};
};

export default useExtendedTransferBetweenAccounts;
