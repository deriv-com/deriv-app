import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import 'Sass/email-sent.scss';

const EmailSent = ({ is_resend_clicked, resend_timeout, resendVerificationEmail, setIsResendClicked }) => (
    <div className='email-sent'>
        <Icon icon='IcEmailSent' className='email-sent__icon' size={128} />
        <Text as='p' weight='bold' align='center' className='email-sent__title'>
            <Localize i18n_default_text={"We've sent you an email."} />
        </Text>
        <Text as='p' size='xs' line_height='s' align='center' className='email-sent'>
            <Localize i18n_default_text='Please check your email for the verification link to complete the process.' />
        </Text>
        <div className='email-sent__resend'>
            {is_resend_clicked ? (
                <React.Fragment>
                    <Text as='p' align='center' weight='bold' size='xs' className='email-sent__title'>
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' align='center' size='xs' line_height='s' className='email-sent'>
                        <Localize
                            i18n_default_text={
                                "Check your spam or junk folder. If it's not there, try resending the email."
                            }
                        />
                    </Text>
                    <Button
                        className='email-sent__resend-button'
                        classNameSpan='email-sent__resend-button-text'
                        is_disabled={resend_timeout < 60}
                        has_effect
                        text={
                            resend_timeout < 60
                                ? localize('Resend email in {{seconds}}s', {
                                      seconds: resend_timeout,
                                  })
                                : localize('Resend email')
                        }
                        onClick={resendVerificationEmail}
                        primary
                        large
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

EmailSent.propTypes = {
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    setIsResendClicked: PropTypes.func,
};

export default EmailSent;
