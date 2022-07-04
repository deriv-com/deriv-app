import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ResendEmailButtonWrapper from 'Components/resend-email-button-wrapper';
import './verification-email.scss';

type TVerificationEmailProps = {
    is_resend_clicked: boolean;
    is_withdrawal: boolean;
    resendVerificationEmail: () => void;
    setIsResendClicked: (is_resend_clicked: boolean) => void;
};

const VerificationEmail = ({
    is_resend_clicked,
    is_withdrawal,
    resendVerificationEmail,
    setIsResendClicked,
}: TVerificationEmailProps) => (
    <div className='verification-email'>
        <Icon icon='IcEmailSent' className='verification-email__icon' size={128} />
        <Text as='p' weight='bold' align='center' className='verification-email__title'>
            <Localize i18n_default_text={"We've sent you an email."} />
        </Text>
        <Text as='p' size='xs' line_height='s' align='center' className='verification-email'>
            <Localize i18n_default_text='Please check your email for the verification link to complete the process.' />
        </Text>
        <div className='verification-email__resend'>
            {is_resend_clicked ? (
                <React.Fragment>
                    <Text as='p' align='center' weight='bold' size='xs' className='verification-email__title'>
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' align='center' size='xs' line_height='s' className='verification-email'>
                        <Localize
                            i18n_default_text={
                                "Check your spam or junk folder. If it's not there, try resending the email."
                            }
                        />
                    </Text>
                    <ResendEmailButtonWrapper
                        resendVerificationEmail={resendVerificationEmail}
                        is_withdrawal={is_withdrawal}
                    />
                </React.Fragment>
            ) : (
                <Button
                    onClick={() => setIsResendClicked(true)}
                    text={localize("Didn't receive the email?")}
                    tertiary
                />
            )}
        </div>
    </div>
);

export default VerificationEmail;
