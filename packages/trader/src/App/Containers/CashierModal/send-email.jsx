import PropTypes      from 'prop-types';
import React          from 'react';
import { Button }     from 'deriv-components';
import Localize       from 'App/Components/Elements/localize.jsx';
import { localize }   from 'App/i18n';
import Icon           from 'Assets/icon.jsx';
import { connect }    from 'Stores/connect';
import EmailSent      from './email-sent.jsx';

class SendEmail extends React.Component {
    render() {
        return (
            <div className='cashier__wrapper'>
                {this.props.is_email_sent ?
                    <EmailSent />
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
    is_email_sent        : PropTypes.bool,
    sendVerificationEmail: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        is_email_sent        : modules.cashier.config.verification.is_email_sent,
        sendVerificationEmail: modules.cashier.sendVerificationEmail,
    })
)(SendEmail);
