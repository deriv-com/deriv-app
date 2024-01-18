import React, { useEffect, useState } from 'react';
import { WalletsResetMT5Password } from '../../components';
import { useModal } from '../../components/ModalProvider';
import { getActionFromUrl } from '../../helpers/urls';
import { TPlatforms } from '../../types';
import { PlatformDetails } from './constants';

const ResetMT5PasswordHandler = () => {
    const { show } = useModal();
    const [password, setPassword] = useState('');
    const resetTradingPlatformActionParams = getActionFromUrl();

    const platformMapping: Record<string, Exclude<TPlatforms.All, 'ctrader'>> = {
        trading_platform_dxtrade_password_reset: PlatformDetails?.dxtrade?.platform,
        trading_platform_investor_password_reset: PlatformDetails?.mt5?.platform,
        trading_platform_mt5_password_reset: PlatformDetails?.mt5?.platform,
    };

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
                        onChange={e => setPassword(e.target.value)}
                        password={password}
                        platform={platformKey}
                        verificationCode={verificationCode}
                    />
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password]);

    return null;
};

export default ResetMT5PasswordHandler;
