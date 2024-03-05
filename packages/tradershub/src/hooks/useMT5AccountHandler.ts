import { useCFDContext } from '@/providers';
import {
    useAccountStatus,
    useActiveTradingAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api-v2';
import { Category, CFDPlatforms, MarketType } from '../features/cfd/constants';
import { Jurisdiction } from '../features/cfd/screens/CFDCompareAccounts/constants';

const useMT5AccountHandler = () => {
    const { data: accountStatus, status } = useAccountStatus();
    const {
        error: isCreateMT5AccountError,
        isLoading: createMT5AccountLoading,
        isSuccess: isCreateMT5AccountSuccess,
        mutate: createMT5Account,
    } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: settings } = useSettings();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const { cfdState } = useCFDContext();
    const { marketType: marketTypeState, selectedJurisdiction } = cfdState;
    const marketType = marketTypeState ?? MarketType.ALL;

    const accountType = marketType === MarketType.SYNTHETIC ? 'gaming' : marketType;
    const categoryAccountType = activeTrading?.is_virtual ? Category.DEMO : accountType;
    const handleSubmit = (password: string) => {
        // in order to create account, we need to set a password through trading_platform_password_change endpoint first
        // then only mt5_create_account can be called, otherwise it will response an error for password required
        if (isMT5PasswordNotSet) {
            return tradingPasswordChange({
                new_password: password,
                platform: CFDPlatforms.MT5,
            }).then(() => {
                return createPassword(password);
            });
        }

        createPassword(password);
    };
    const createPassword = (password: string) =>
        createMT5Account({
            payload: {
                account_type: categoryAccountType,
                address: settings?.address_line_1 ?? '',
                city: settings?.address_city ?? '',
                company: selectedJurisdiction,
                country: settings?.country_code ?? '',
                email: settings?.email ?? '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage ?? 500,
                mainPassword: password,
                ...(marketType === MarketType.FINANCIAL && { mt5_account_type: MarketType.FINANCIAL }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== Jurisdiction.LABUAN
                        ? {
                              ...(marketType === MarketType.FINANCIAL && {
                                  mt5_account_type: MarketType.FINANCIAL,
                              }),
                          }
                        : {
                              account_type: MarketType.FINANCIAL,
                              mt5_account_type: 'financial_stp',
                          })),
                ...(marketType === MarketType.ALL && { sub_account_category: 'swap_free' }),
                name: settings?.first_name ?? '',
                phone: settings?.phone ?? '',
                state: settings?.address_state ?? '',
                zipCode: settings?.address_postcode ?? '',
            },
        });

    return {
        createMT5AccountLoading,
        handleSubmit,
        isCreateMT5AccountError,
        isCreateMT5AccountSuccess,
        status,
        tradingPlatformPasswordChangeLoading,
    };
};

export default useMT5AccountHandler;
