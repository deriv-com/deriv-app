import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import Localize         from 'App/Components/Elements/localize.jsx';
import Button           from 'App/Components/Form/button.jsx';
import { localize }     from 'App/i18n';
import Icon             from 'Assets/icon.jsx';
import { connect }      from 'Stores/connect';
import CashierContainer from './cashier-container.jsx';

const SendEmail = ({
    client_email,
    is_button_clicked,
    is_email_sent,
    sendVerificationEmail,
}) => (
    <div className='withdraw__verify-wrapper'>
        <Icon icon='IconAuthenticateWithdrawals' className='withdraw__icon-authenticate' />
        <p className='withdraw__text'>
            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
        </p>
        <Button
            className={classNames('btn--primary btn--primary--orange withdraw__verify-button', { 'btn--disabled': is_button_clicked })}
            is_disabled={is_button_clicked}
            classNameSpan='withdraw__verify-button-text'
            has_effect
            text={localize('Get authentication email')}
            onClick={() => { sendVerificationEmail(client_email); }}
        />
        {is_email_sent &&
            <div className='withdraw__email-sent'>
                <h1><Localize i18n_default_text="We've sent you an email." /></h1>
                <p><Localize i18n_default_text='Please click on the authentication link in the email to continue.' /></p>
            </div>
        }
    </div>
);

SendEmail.propTypes = {
    client_email         : PropTypes.string,
    is_button_clicked    : PropTypes.bool,
    is_email_sent        : PropTypes.bool,
    sendVerificationEmail: PropTypes.func,
};

const Withdraw = ({
    client_email,
    container_height,
    error_message,
    is_loading,
    is_verification_button_clicked,
    is_verification_email_sent,
    onMount,
    sendVerificationEmail,
    verification_code,
    withdraw_url,
}) => (
    <React.Fragment>
        {(verification_code || withdraw_url || error_message) ?
            <CashierContainer
                container_height={container_height}
                container_url={withdraw_url}
                error_message={error_message}
                is_loading={is_loading}
                onMount={onMount}
                verification_code={verification_code}
            />
            :
            <SendEmail
                client_email={client_email}
                sendVerificationEmail={sendVerificationEmail}
                is_button_clicked={is_verification_button_clicked}
                is_email_sent={is_verification_email_sent}
            />
        }
    </React.Fragment>
);

Withdraw.propTypes = {
    client_email    : PropTypes.string,
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    error_message                 : PropTypes.string,
    is_loading                    : PropTypes.bool,
    is_verification_button_clicked: PropTypes.bool,
    is_verification_email_sent    : PropTypes.bool,
    onMount                       : PropTypes.func,
    sendVerificationEmail         : PropTypes.func,
    verification_code             : PropTypes.string,
    withdraw_url                  : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        client_email                  : client.email,
        container_height              : modules.cashier.container_height,
        error_message                 : modules.cashier.error_message,
        is_verification_button_clicked: modules.cashier.is_verification_button_clicked,
        is_verification_email_sent    : modules.cashier.is_verification_email_sent,
        is_loading                    : modules.cashier.is_loading,
        onMount                       : modules.cashier.onMountWithdraw,
        sendVerificationEmail         : modules.cashier.sendVerificationEmail,
        verification_code             : client.verification_code,
        withdraw_url                  : modules.cashier.container_urls.withdraw,
    })
)(Withdraw);
