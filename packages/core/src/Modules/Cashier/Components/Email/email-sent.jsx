import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class EmailSent extends React.Component {
    onClickVerification = () => {
        this.props.setVerificationResendClicked(true);
    };

    render() {
        return (
            <div className='withdraw__email-sent'>
                <Icon icon='IcEmailSent' className='withdraw__icon' size={128} />
                <p className='withdraw__email-sent-title'>
                    <Localize i18n_default_text={"We've sent you an email."} />
                </p>
                <p className='withdraw__email-sent-text'>
                    <Localize i18n_default_text='Please check your email for the verification link to complete the process.' />
                </p>
                <div className='withdraw__email-resend'>
                    {this.props.is_resend_clicked ? (
                        <React.Fragment>
                            <p className='withdraw__email-sent-title withdraw__email-sent-title-sub'>
                                <Localize i18n_default_text={"Didn't receive the email?"} />
                            </p>
                            <p className='withdraw__email-sent-text'>
                                <Localize
                                    i18n_default_text={
                                        "Check your spam or junk folder. If it's not there, try resending the email."
                                    }
                                />
                            </p>
                            <Button
                                className='withdraw__resend-button'
                                classNameSpan='withdraw__resend-button-text'
                                is_disabled={this.props.resend_timeout < 60}
                                has_effect
                                text={
                                    this.props.resend_timeout < 60
                                        ? localize('Resend email in {{seconds}}s', {
                                              seconds: this.props.resend_timeout,
                                          })
                                        : localize('Resend email')
                                }
                                onClick={this.props.resendVerificationEmail}
                                primary
                                large
                            />
                        </React.Fragment>
                    ) : (
                        <Button
                            className='withdraw__email-resend-text'
                            text={localize("Didn't receive the email?")}
                            onClick={this.onClickVerification}
                            tertiary
                        />
                    )}
                </div>
            </div>
        );
    }
}

EmailSent.propTypes = {
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    setVerificationResendClicked: PropTypes.func,
};

export default connect(({ modules }) => ({
    resendVerificationEmail: modules.cashier.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.sendVerificationEmail,
    setVerificationResendClicked: modules.cashier.setVerificationResendClicked,
}))(EmailSent);
