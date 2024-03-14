import React, { useEffect, useMemo } from 'react';
import { WalletsResetMT5Password } from '../../components';
import { useModal } from '../../components/ModalProvider';
import { getActionFromUrl } from '../../helpers/urls';
import { TPlatforms } from '../../types';
import { CFD_PLATFORMS } from './constants';

const ResetMT5PasswordHandler = () => {
    const { show } = useModal();
    const resetTradingPlatformActionParams = getActionFromUrl();

    const platformMapping: Record<string, Exclude<TPlatforms.All, 'ctrader'>> = useMemo(
        () => ({
            trading_platform_dxtrade_password_reset: CFD_PLATFORMS?.DXTRADE,
            trading_platform_investor_password_reset: CFD_PLATFORMS?.MT5,
            trading_platform_mt5_password_reset: CFD_PLATFORMS?.MT5,
        }),
        []
    );

    useEffect(() => {
        const platformKey = resetTradingPlatformActionParams ? platformMapping[resetTradingPlatformActionParams] : null;

        if (platformKey) {
            const verificationCode = localStorage.getItem(`verification_code.${resetTradingPlatformActionParams}`);

            if (verificationCode) {
                show(
                    <WalletsResetMT5Password
                        actionParams={resetTradingPlatformActionParams ?? ''}
                        isInvestorPassword={
                            resetTradingPlatformActionParams === 'trading_platform_investor_password_reset'
                        }
                        platform={platformKey}
                        verificationCode={verificationCode}
                    />
                );
            }
        }
    }, [platformMapping, resetTradingPlatformActionParams, show]);

    return null;
};

export default ResetMT5PasswordHandler;
