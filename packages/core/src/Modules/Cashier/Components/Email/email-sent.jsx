import PropTypes              from 'prop-types';
import React                  from 'react';
import { Button }             from 'deriv-components';
import { BinaryLink }         from 'App/Components/Routes';
import { localize, Localize } from 'deriv-translations';
import Icon                   from 'Assets/icon.jsx';
import { connect }            from 'Stores/connect';

class EmailSent extends React.Component {
    onClickVerification = () => { this.props.setVerificationResendClicked(true); };

    render() {
        return (
            <div className='withdraw__email-sent'>
                <Icon icon='IconEmailSent' className='withdraw__icon' />
                <p className='withdraw__email-sent-title'><Localize i18n_default_text={'We\'ve sent you an email.'} /></p>
                <p className='withdraw__email-sent-text'><Localize i18n_default_text='Please click on the link in the email to access withdrawal.' /></p>
                <div className='withdraw__email-resend'>
                    {this.props.is_resend_clicked ?
                        <React.Fragment>
                            <p className='withdraw__email-sent-title withdraw__email-sent-title-sub'><Localize i18n_default_text={'Didn\'t receive the email?'} /></p>
                            <p className='withdraw__email-sent-text'><Localize i18n_default_text={'Check your spam or junk folder. If it\'s not there, try resending the email.'} /></p>
                            <Button
                                className='withdraw__resend-button'
                                classNameSpan='withdraw__resend-button-text'
                                is_disabled={this.props.resend_timeout < 60}
                                has_effect
                                text={this.props.resend_timeout < 60 ? localize('Resend email in {{seconds}}s', { seconds: this.props.resend_timeout }) : localize('Resend email')}
                                onClick={this.props.resendVerificationEmail}
                                primary
                                large
                            />
                        </React.Fragment>
                        :
                        <BinaryLink className='withdraw__email-resend-text' onClick={this.onClickVerification}>
                            <Localize i18n_default_text={'Didn\'t receive the email?'} />
                        </BinaryLink>
                    }
                </div>
            </div>
        );
    }
}

EmailSent.propTypes = {
    is_resend_clicked           : PropTypes.bool,
    resend_timeout              : PropTypes.number,
    resendVerificationEmail     : PropTypes.func,
    setVerificationResendClicked: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        resendVerificationEmail     : modules.cashier.resendVerificationEmail,
        sendVerificationEmail       : modules.cashier.sendVerificationEmail,
        setVerificationResendClicked: modules.cashier.setVerificationResendClicked,
    })
)(EmailSent);
