import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TCFDPasswordReset } from 'Containers/props.types';
import { CountdownComponent } from './countdown-component';

export const CFDPasswordReset = ({
    sendVerifyEmail,
    account_type,
    account_group,
    server,
    password_type,
}: TCFDPasswordReset) => {
    const [is_resend_verification_requested, setIsResendVerificationRequested] = React.useState<boolean>(false);
    const [is_resend_verification_sent, setIsResendVerificationSent] = React.useState<boolean>(false);

    React.useEffect(() => {
        localStorage.setItem('cfd_reset_password_intent', [server, account_group, account_type].join('.'));
        localStorage.setItem('cfd_reset_password_type', password_type);
        sendVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickVerification = () => {
        setIsResendVerificationRequested(true);
    };

    const resendVerification = () => {
        sendVerifyEmail();
        setIsResendVerificationSent(true);
    };

    return (
        <div className='cfd-verification-email-sent'>
            <Icon icon='IcEmailSent' size={128} />
            <h2 className='cfd-verification-email-sent__title'>
                <Localize i18n_default_text="We've sent you an email" />
            </h2>
            <Text as='p' size='xs' align='center'>
                <Localize i18n_default_text='Please click on the link in the email to reset your password.' />
            </Text>
            {!is_resend_verification_requested ? (
                <Button className='cfd-verification-email-sent__resend-button' primary onClick={onClickVerification}>
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Button>
            ) : (
                <React.Fragment>
                    <Text
                        as='p'
                        size='xs'
                        align='center'
                        weight='bold'
                        className='cfd-verification-email-sent__title--sub'
                    >
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' size='xs' align='center'>
                        <Localize i18n_default_text="Check your spam or junk folder. If it's not there, try resending the email." />
                    </Text>
                    <Button
                        className='cfd-verification-email-sent__resend-button'
                        large
                        primary
                        disabled={is_resend_verification_sent}
                        onClick={resendVerification}
                    >
                        {!is_resend_verification_sent && <Localize i18n_default_text='Resend email' />}
                        {is_resend_verification_sent && (
                            <Localize
                                i18n_default_text='Resend in <0 /> seconds'
                                components={[
                                    <CountdownComponent
                                        key={0}
                                        onTimeout={() => setIsResendVerificationSent(false)}
                                        count_from={60}
                                    />,
                                ]}
                            />
                        )}
                    </Button>
                </React.Fragment>
            )}
        </div>
    );
};
