import React, { useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import { useSettings, useVerifyEmail } from '@deriv/api';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import ChangePassword from '../../public/images/change-password-email.svg';
import EmailIcon from '../../public/images/ic-email.svg';
import EmailFirewallIcon from '../../public/images/ic-email-firewall.svg';
import EmailSpamIcon from '../../public/images/ic-email-spam.svg';
import EmailTypoIcon from '../../public/images/ic-email-typo.svg';
import { TPlatforms } from '../../types';
import { WalletButton, WalletText } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './SentEmailContent.scss';

type TProps = {
    description?: string;
    platform?: TPlatforms.All;
};

const REASONS = [
    {
        icon: EmailSpamIcon,
        text: 'The email is in your spam folder (Sometimes things get lost there).',
    },
    {
        icon: EmailIcon,
        text: 'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).',
    },
    {
        icon: EmailTypoIcon,
        text: 'The email address you entered had a mistake or typo (happens to the best of us).',
    },
    {
        icon: EmailFirewallIcon,
        text: 'We can’t deliver the email to this address (Usually because of firewalls or filtering).',
    },
];

const SentEmailContent: React.FC<TProps> = ({ description, platform }) => {
    const [shouldShowResendEmailReasons, setShouldShowResendEmailReasons] = useState(false);
    const [hasCountdownStarted, setHasCountdownStarted] = useState(false);
    const { data } = useSettings();
    const { mutate: verifyEmail } = useVerifyEmail();
    const { isMobile } = useDevice();
    const title = PlatformDetails[platform || 'mt5'].title;
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

    return (
        <div className='wallets-sent-email-content'>
            <WalletsActionScreen
                description={description ?? `Please click on the link in the email to change your ${title} password.`}
                descriptionSize={descriptionSize}
                icon={<ChangePassword />}
                renderButtons={() => (
                    <WalletButton
                        onClick={() => {
                            setShouldShowResendEmailReasons(true);
                        }}
                        size={emailLinkSize}
                        text="Didn't receive the email?"
                        variant='ghost'
                    />
                )}
                title='We’ve sent you an email'
                titleSize={titleSize}
            />
            {shouldShowResendEmailReasons && (
                <div className='wallets-sent-email-content__reasons'>
                    {REASONS.map(reason => (
                        <div className='wallets-sent-email-content__reasons-item' key={`reason-${reason.text}`}>
                            <reason.icon />
                            <WalletText size='xs'>{reason.text}</WalletText>
                        </div>
                    ))}
                    <WalletButton
                        disabled={hasCountdownStarted}
                        onClick={() => {
                            if (data?.email) {
                                verifyEmail({
                                    type:
                                        platform === 'mt5'
                                            ? 'trading_platform_mt5_password_reset'
                                            : 'trading_platform_dxtrade_password_reset',
                                    verify_email: data?.email,
                                });
                                resetCountdown();
                                startCountdown();
                                setHasCountdownStarted(true);
                            }
                        }}
                        text={hasCountdownStarted ? `Resend email in ${count}` : 'Resend email'}
                    />
                </div>
            )}
        </div>
    );
};

export default SentEmailContent;
