import React, { FC, Fragment, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useCountdown } from 'usehooks-ts';
import { useActiveWalletAccount, useSettings, useVerifyEmail } from '@deriv/api';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import ChangePassword from '../../public/images/change-password-email.svg';
import { TPlatforms } from '../../types';
import { platformPasswordResetRedirectLink } from '../../utils/cfd';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './SentEmailContent.scss';

type TProps = {
    description?: string;
    isInvestorPassword?: boolean;
    platform?: TPlatforms.All;
};

const SentEmailContent: FC<TProps> = ({ description, isInvestorPassword = false, platform }) => {
    const [shouldShowResendEmailReasons, setShouldShowResendEmailReasons] = useState(false);
    const [hasCountdownStarted, setHasCountdownStarted] = useState(false);
    const { data } = useSettings();
    const { mutate: verifyEmail } = useVerifyEmail();
    const { isMobile } = useDevice();
    const mt5Platform = PlatformDetails.mt5.platform;
    const title = PlatformDetails[platform ?? mt5Platform].title;
    const titleSize = 'md';
    const descriptionSize = 'sm';
    const emailLinkSize = isMobile ? 'lg' : 'md';
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    useEffect(() => {
        if (count === 0) setHasCountdownStarted(false);
    }, [count]);

    const { data: activeWallet } = useActiveWalletAccount();

    return (
        <div className='wallets-sent-email-content'>
            <WalletsActionScreen
                description={description ?? `Please click on the link in the email to change your ${title} password.`}
                descriptionSize={descriptionSize}
                icon={<ChangePassword />}
                renderButtons={() =>
                    shouldShowResendEmailReasons && isInvestorPassword ? null : (
                        <WalletButton
                            onClick={() => {
                                setShouldShowResendEmailReasons(true);
                            }}
                            size={emailLinkSize}
                            variant='ghost'
                        >
                            <Trans defaults="Didn't receive the email?" />
                        </WalletButton>
                    )
                }
                title='We’ve sent you an email'
                titleSize={titleSize}
            />
            {shouldShowResendEmailReasons && (
                <Fragment>
                    {isInvestorPassword && (
                        <div className='wallets-sent-email-content__resend'>
                            <WalletsActionScreen
                                description="Check your spam or junk folder. If it's not there, try resending the email."
                                descriptionSize={descriptionSize}
                                title="Didn't receive the email?"
                                titleSize={titleSize}
                            />
                        </div>
                    )}
                    <WalletButton
                        disabled={hasCountdownStarted}
                        onClick={() => {
                            if (data?.email) {
                                verifyEmail({
                                    type:
                                        platform === mt5Platform
                                            ? 'trading_platform_mt5_password_reset'
                                            : 'trading_platform_dxtrade_password_reset',
                                    url_parameters: {
                                        redirect_to: platformPasswordResetRedirectLink(
                                            platform ?? mt5Platform,
                                            activeWallet?.is_virtual
                                        ),
                                    },
                                    verify_email: data?.email,
                                });
                                resetCountdown();
                                startCountdown();
                                setHasCountdownStarted(true);
                            }
                        }}
                    >
                        {hasCountdownStarted ? `Resend email in ${count}` : 'Resend email'}
                    </WalletButton>
                </Fragment>
            )}
        </div>
    );
};

export default SentEmailContent;
