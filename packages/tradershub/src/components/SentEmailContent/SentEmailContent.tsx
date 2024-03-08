import React, { Fragment, useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import ChangePassword from '@/assets/svgs/change-password-email.svg';
import { ActionScreen } from '@/components';
import { useCFDContext } from '@/providers';
import { platformPasswordResetRedirectLink } from '@/utils';
import { PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount, useSettings, useVerifyEmail } from '@deriv/api-v2';
import { Button, useDevice } from '@deriv-com/ui';

const SentEmailContent = () => {
    const { cfdState } = useCFDContext();
    const { platform, description, isInvestorPassword } = cfdState;
    const [shouldShowResendEmailReasons, setShouldShowResendEmailReasons] = useState(false);
    const [hasCountdownStarted, setHasCountdownStarted] = useState(false);
    const { data } = useSettings();
    const { mutate: verifyEmail } = useVerifyEmail();
    const { isDesktop } = useDevice();
    const mt5Platform = PlatformDetails.mt5.platform;
    const title = PlatformDetails[platform ?? mt5Platform].title;
    const titleSize = 'md';
    const descriptionSize = 'sm';
    const emailLinkSize = isDesktop ? 'md' : 'lg';
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    useEffect(() => {
        if (count === 0) setHasCountdownStarted(false);
    }, [count]);

    const { data: activeTrading } = useActiveTradingAccount();

    const renderButton = () => {
        if (shouldShowResendEmailReasons && isInvestorPassword) {
            return null;
        }
        return (
            <Button
                className='border-none'
                color='primary-light'
                onClick={() => {
                    setShouldShowResendEmailReasons(true);
                }}
                size={emailLinkSize}
                variant='ghost'
            >
                Didn&apos;t receive the email?
            </Button>
        );
    };

    const handleButtonClick = () => {
        if (data?.email) {
            verifyEmail({
                type:
                    platform === mt5Platform
                        ? 'trading_platform_mt5_password_reset'
                        : 'trading_platform_dxtrade_password_reset',
                url_parameters: {
                    redirect_to: platformPasswordResetRedirectLink(platform ?? mt5Platform, activeTrading?.is_virtual),
                },
                verify_email: data?.email,
            });
            resetCountdown();
            startCountdown();
            setHasCountdownStarted(true);
        }
    };

    return (
        <div className='w-full lg:w-[400px] inline-flex p-32 flex-col justify-center items-center gap-24 rounded-default bg-system-light-primary-background'>
            <ActionScreen
                description={description ?? `Please click on the link in the email to change your ${title} password.`}
                descriptionSize={descriptionSize}
                icon={<ChangePassword />}
                renderButtons={renderButton}
                title='We’ve sent you an email'
                titleSize={titleSize}
            />
            {shouldShowResendEmailReasons && (
                <Fragment>
                    {isInvestorPassword && (
                        <div className='flex flex-col items-center gap-16'>
                            <ActionScreen
                                description="Check your spam or junk folder. If it's not there, try resending the email."
                                descriptionSize={descriptionSize}
                                title="Didn't receive the email?"
                                titleSize={titleSize}
                            />
                        </div>
                    )}
                    <Button disabled={hasCountdownStarted} onClick={handleButtonClick}>
                        {hasCountdownStarted ? `Resend email in ${count}` : 'Resend email'}
                    </Button>
                </Fragment>
            )}
        </div>
    );
};

export default SentEmailContent;
