import React, { FC, useEffect } from 'react';
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
    const mt5Platform = PlatformDetails.mt5.platform;
    const { isMobile } = useDevice();

    const { data: activeWallet } = useActiveWalletAccount();

    const mt5ResetType = isInvestorPassword
        ? 'trading_platform_investor_password_reset'
        : 'trading_platform_mt5_password_reset';

    useEffect(() => {
        if (data?.email) {
            verifyEmail({
                type: platform === mt5Platform ? mt5ResetType : 'trading_platform_dxtrade_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform ?? mt5Platform, activeWallet?.is_virtual),
                },
                verify_email: data?.email,
            });
        }
    }, [data.email, activeWallet?.is_virtual, mt5Platform, mt5ResetType]);

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
