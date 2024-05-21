import {
    useAccountStatus,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useSettings,
    useTradingPlatformPasswordChange,
} from '@deriv/api-v2';
import { CFD_PLATFORMS, JURISDICTION, MARKET_TYPE } from '../features/cfd/constants';
import { THooks } from '../types';

const useMT5AccountHandler = (
    selectedJurisdiction: THooks.MT5AccountsList['landing_company_short'] | string | undefined,
    selectedMarketType: Exclude<THooks.CreateMT5Account['account_type'], undefined>
) => {
    const { data: accountStatus, status } = useAccountStatus();
    const {
        error: isCreateMT5AccountError,
        isLoading: createMT5AccountLoading,
        isSuccess: isCreateMT5AccountSuccess,
        mutate: createMT5Account,
        status: createMT5AccountStatus,
    } = useCreateMT5Account();
    const { isLoading: tradingPlatformPasswordChangeLoading, mutateAsync: tradingPasswordChange } =
        useTradingPlatformPasswordChange();
    const { data: settings } = useSettings();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();

    const isMT5PasswordNotSet = accountStatus?.is_mt5_password_not_set;

    const doesNotMeetPasswordPolicy =
        isCreateMT5AccountError?.error?.code === 'InvalidTradingPlatformPasswordFormat' ||
        isCreateMT5AccountError?.error?.code === 'IncorrectMT5PasswordFormat';

    // in order to create account, we need to set a password through trading_platform_password_change endpoint first
    // then only mt5_create_account can be called, otherwise it will response an error for password required
    const onSubmit = async (password: string) => {
        if (isMT5PasswordNotSet) {
            await tradingPasswordChange({
                new_password: password,
                platform: CFD_PLATFORMS.MT5,
            });
        }

        await createPassword(password);
    };

    const createPassword = (password: string) =>
        createMT5Account({
            payload: {
                account_type: selectedMarketType,
                company: selectedJurisdiction,
                country: settings?.country_code ?? '',
                email: settings?.email ?? '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === selectedMarketType)?.leverage ?? 500,
                mainPassword: password,
                ...(selectedMarketType === MARKET_TYPE.FINANCIAL && { mt5_account_type: MARKET_TYPE.FINANCIAL }),
                ...(selectedJurisdiction &&
                    (selectedJurisdiction !== JURISDICTION.LABUAN
                        ? {
                              ...(selectedMarketType === MARKET_TYPE.FINANCIAL && {
                                  mt5_account_type: MARKET_TYPE.FINANCIAL,
                              }),
                          }
                        : {
                              account_type: MARKET_TYPE.FINANCIAL,
                              mt5_account_type: 'financial_stp',
                          })),
                ...(selectedMarketType === MARKET_TYPE.ALL && { sub_account_category: 'swap_free' }),
                name: settings?.first_name ?? '',
            },
        });

    return {
        createMT5AccountLoading,
        createMT5AccountStatus,
        doesNotMeetPasswordPolicy,
        isCreateMT5AccountError,
        isCreateMT5AccountSuccess,
        onSubmit,
        status,
        tradingPlatformPasswordChangeLoading,
    };
};

export default useMT5AccountHandler;
