import React, { useEffect } from 'react';
import { WalletsResetMT5Password } from '../../components';
import { useModal } from '../../components/ModalProvider';
import { getActionFromUrl } from '../../helpers/urls';
import { CFD_PLATFORMS } from './constants';

const platformMapping = {
    trading_platform_dxtrade_password_reset: CFD_PLATFORMS?.DXTRADE,
    trading_platform_investor_password_reset: CFD_PLATFORMS?.MT5,
    trading_platform_mt5_password_reset: CFD_PLATFORMS?.MT5,
} as const;

const ResetMT5PasswordHandler = () => {
    const { show } = useModal();
    const resetTradingPlatformActionParams = getActionFromUrl();

    const platformKey = resetTradingPlatformActionParams
        ? platformMapping[resetTradingPlatformActionParams as keyof typeof platformMapping]
        : null;

    useEffect(() => {
        if (platformKey) {
            const verificationCode = localStorage.getItem(`verification_code.${resetTradingPlatformActionParams}`);

            if (verificationCode && resetTradingPlatformActionParams) {
                show(
                    <WalletsResetMT5Password
                        actionParams={resetTradingPlatformActionParams}
                        isInvestorPassword={
                            resetTradingPlatformActionParams === 'trading_platform_investor_password_reset'
                        }
                        platform={platformKey}
                        verificationCode={verificationCode}
                    />
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [platformKey, resetTradingPlatformActionParams]);

    return null;
};

export default ResetMT5PasswordHandler;
