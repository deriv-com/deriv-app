import PropTypes      from 'prop-types';
import React          from 'react';
import Localize       from 'App/Components/Elements/localize.jsx';
import Button         from 'App/Components/Form/button.jsx';
import { BinaryLink } from 'App/Components/Routes';
import { localize }   from 'App/i18n';
import Icon           from 'Assets/icon.jsx';
import { connect }    from 'Stores/connect';

class SendEmail extends React.Component {
    render() {
        return (
            <div className='withdraw__wrapper'>
                {this.props.is_email_sent ?
                    <div className='withdraw__email-sent'>
                        <Icon icon='IconEmailSent' className='withdraw__icon' />
                        <p className='withdraw__email-sent-title'><Localize i18n_default_text="We've sent you an email." /></p>
                        <p className='withdraw__email-sent-text'><Localize i18n_default_text='Please click on the authentication link in the email to access withdrawal.' /></p>
                        <div className='withdraw__email-resend'>
                            {this.props.is_resend_clicked ?
                                <React.Fragment>
                                    <p className='withdraw__email-sent-title withdraw__email-sent-title-sub'><Localize i18n_default_text="Didn't receive our email?" /></p>
                                    <p className='withdraw__email-sent-text'><Localize i18n_default_text="Please check your spam folder. If it's not there, try resending the email." /></p>
                                    <Button
                                        className='btn--secondary btn--secondary--orange withdraw__resend-button'
                                        classNameSpan='withdraw__resend-button-text'
                                        is_disabled={this.props.resend_timeout < 60}
                                        has_effect
                                        text={this.props.resend_timeout < 60 ? localize('Resend email in {{seconds}}s', { seconds: this.props.resend_timeout }) : localize('Resend email')}
                                        onClick={this.props.resendVerificationEmail}
                                    />
                                </React.Fragment>
                                :
                                <BinaryLink className='withdraw__email-resend-text' onClick={() => { this.props.setVerificationResendClicked(true); }}>
                                    <Localize i18n_default_text="Didn't receive our email?" />
                                </BinaryLink>
                            }
                        </div>
                    </div>
                    :
                    <React.Fragment>
                        <Icon icon='IconAuthenticateWithdrawals' className='withdraw__icon' />
                        <p className='withdraw__text'>
                            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
                        </p>
                        <Button
                            className='btn--primary btn--primary--orange withdraw__verify-button'
                            classNameSpan='withdraw__verify-button-text'
                            has_effect
                            text={localize('Get authentication email')}
                            onClick={this.props.sendVerificationEmail}
                        />
                    </React.Fragment>
                }
            </div>
        );
    }
}

SendEmail.propTypes = {
    is_email_sent               : PropTypes.bool,
    is_resend_clicked           : PropTypes.bool,
    resend_timeout              : PropTypes.number,
    resendVerificationEmail     : PropTypes.func,
    sendVerificationEmail       : PropTypes.func,
    setVerificationResendClicked: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        is_email_sent               : modules.cashier.config.verification.is_email_sent,
        is_resend_clicked           : modules.cashier.config.verification.is_resend_clicked,
        resend_timeout              : modules.cashier.config.verification.resend_timeout,
        resendVerificationEmail     : modules.cashier.resendVerificationEmail,
        sendVerificationEmail       : modules.cashier.sendVerificationEmail,
        setVerificationResendClicked: modules.cashier.setVerificationResendClicked,
    })
)(SendEmail);
