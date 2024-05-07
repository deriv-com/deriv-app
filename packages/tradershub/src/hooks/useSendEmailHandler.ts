import { useCFDContext } from '@/providers';
import { platformPasswordResetRedirectLink } from '@/utils';
import { useActiveTradingAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { CFDPlatforms } from '../features/cfd/constants';

const useHandleSendEmail = () => {
    const { cfdState } = useCFDContext();
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const { data: activeTrading } = useActiveTradingAccount();
    const { platform = CFDPlatforms.MT5 } = cfdState;

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type:
                    platform === CFDPlatforms.DXTRADE
                        ? 'trading_platform_dxtrade_password_reset'
                        : 'trading_platform_mt5_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform, activeTrading?.is_virtual),
                },
                verify_email: data.email,
            });
        }
    };

    return {
        handleSendEmail,
    };
};

export default useHandleSendEmail;
