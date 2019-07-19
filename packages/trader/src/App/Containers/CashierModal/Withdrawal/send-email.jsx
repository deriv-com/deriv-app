import PropTypes    from 'prop-types';
import React        from 'react';
import Localize     from 'App/Components/Elements/localize.jsx';
import Button       from 'App/Components/Form/button.jsx';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';
import { connect }  from 'Stores/connect';

class SendEmail extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='withdraw__verify-container'>
                    <div className='withdraw__verify-wrapper'>
                        <Icon icon='IconAuthenticateWithdrawals' className='withdraw__icon-authenticate' />
                        <p className='withdraw__text'>
                            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
                        </p>
                        <Button
                            className='btn--primary btn--primary--orange withdraw__verify-button'
                            classNameSpan='withdraw__verify-button-text'
                            has_effect
                            text={localize('Get authentication email')}
                            onClick={() => { this.props.sendVerificationEmail(this.props.client_email); }}
                        />
                    </div>
                </div>
                {this.props.is_email_sent &&
                <div className='withdraw__verify-container'>
                    <div className='withdraw__email-sent'>
                        <Icon icon='IconEmailSent' className='withdraw__icon-authenticate' />
                        <h1><Localize i18n_default_text="We've sent you an email." /></h1>
                        <p><Localize i18n_default_text='Please click on the authentication link in the email to continue.' /></p>
                    </div>
                </div>
                }
            </React.Fragment>
        );
    }
}

SendEmail.propTypes = {
    client_email         : PropTypes.string,
    is_email_sent        : PropTypes.bool,
    sendVerificationEmail: PropTypes.func,
};

export default connect(
    ({ client, modules }) => ({
        client_email         : client.email,
        is_email_sent        : modules.cashier.is_verification_email_sent,
        sendVerificationEmail: modules.cashier.sendVerificationEmail,
    })
)(SendEmail);
