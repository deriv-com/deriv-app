import { useAccountStatus, useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api-v2';
import { MarketType, PlatformDetails } from '../features/cfd/constants';

const useDxtradeAccountHandler = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: getAccountStatus, isSuccess: accountStatusSuccess } = useAccountStatus();
    const {
        error: createDxtradeAccountError,
        isLoading: createDxtradeAccountLoading,
        isSuccess: createOtherCFDAccountSuccess,
        mutate: createDxtradeAccount,
        status,
    } = useCreateOtherCFDAccount();

    const accountType = activeTrading?.is_virtual ? 'demo' : 'real';
    const dxtradePlatform = PlatformDetails.dxtrade.platform;
    const isDxtradePasswordNotSet = getAccountStatus?.is_dxtrade_password_not_set;

    const handleSubmit = (password: string) => {
        return createDxtradeAccount({
            payload: {
                account_type: accountType,
                market_type: MarketType.ALL,
                password,
                platform: dxtradePlatform,
            },
        });
    };

    return {
        accountStatusSuccess,
        createDxtradeAccountError,
        createDxtradeAccountLoading,
        createOtherCFDAccountSuccess,
        handleSubmit,
        isDxtradePasswordNotSet,
        status,
    };
};

export default useDxtradeAccountHandler;
