import {
    useAccountStatus,
    useActiveTradingAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api';
import { TMarketTypes } from '../../../../types';
import { Category, MarketType, PlatformDetails } from '../../constants';
import { Jurisdiction } from '../../screens/CFDCompareAccounts/constants';

type TSubmitHandlerProps = {
    marketType: TMarketTypes.SortedMT5Accounts;
    password: string;
    selectedJurisdiction?: string;
};

export const useSubmitHandler = async ({ marketType, password, selectedJurisdiction }: TSubmitHandlerProps) => {
    const { data: accountStatus } = useAccountStatus();
    const { mutate } = useCreateMT5Account();
    const { mutateAsync: tradingPasswordChange } = useTradingPlatformPasswordChange();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: settings } = useSettings();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const accountType = marketType === MarketType.SYNTHETIC ? 'gaming' : marketType;
    // in order to create account, we need to set a password through trading_platform_password_change endpoint first
    // then only mt5_create_account can be called, otherwise it will response an error for password required
    if (isMT5PasswordNotSet) {
        await tradingPasswordChange({
            new_password: password,
            platform: PlatformDetails.mt5.platform,
        });
    }

    const categoryAccountType = activeTrading?.is_virtual ? Category.DEMO : accountType;
    // make a helper function for this
    mutate({
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
                          account_type: categoryAccountType,
                          ...(selectedJurisdiction === MarketType.FINANCIAL && {
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
};
