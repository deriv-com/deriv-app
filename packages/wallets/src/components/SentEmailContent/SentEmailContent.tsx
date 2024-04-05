import React, { FC, useEffect, useState } from 'react';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import ChangePassword from '../../public/images/change-password-email.svg';
import { TPlatforms } from '../../types';
import { platformPasswordResetRedirectLink } from '../../utils/cfd';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './SentEmailContent.scss';

type SentEmailContentProps = {
    description?: string;
    isInvestorPassword?: boolean;
    platform?: TPlatforms.All;
};

const SentEmailContent: FC<SentEmailContentProps> = ({ description, isInvestorPassword = false, platform }) => {
    const { data } = useSettings();
    const { mutate: verifyEmail } = useVerifyEmail();
    const { isMobile } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const [hasSentEmail, sethasSentEmail] = useState(false);

    useEffect(() => {
        if (data?.email && !hasSentEmail) {
            const mt5Platform = PlatformDetails.mt5.platform;
            const mt5ResetType = isInvestorPassword
                ? 'trading_platform_investor_password_reset'
                : 'trading_platform_mt5_password_reset';
            verifyEmail({
                type: platform === mt5Platform ? mt5ResetType : 'trading_platform_dxtrade_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform ?? mt5Platform, activeWallet?.is_virtual),
                },
                verify_email: data?.email,
            });
            sethasSentEmail(true);
        }
    }, [activeWallet?.is_virtual, data?.email, hasSentEmail, isInvestorPassword, platform, verifyEmail]);

    return (
        <div className='wallets-sent-email-content'>
            <WalletsActionScreen
                description={description ?? `Please click on the link in the email to reset your password.`}
                descriptionSize={isMobile ? 'lg' : 'sm'}
                icon={<ChangePassword />}
                title='We’ve sent you an email'
                titleSize={isMobile ? 'lg' : 'md'}
            />
        </div>
    );
};

export default SentEmailContent;
