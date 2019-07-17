import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import Localize         from 'App/Components/Elements/localize.jsx';
import Button           from 'App/Components/Form/button.jsx';
import { localize }     from 'App/i18n';
import Icon             from 'Assets/icon.jsx';
import { connect }      from 'Stores/connect';
import CashierContainer from './cashier-container.jsx';

const SendEmail = ({ client_email, is_button_disabled, sendVerificationEmail }) => (
    <div className='withdraw__verify-wrapper'>
        <Icon icon='IconAuthenticateWithdrawals' className='withdraw__icon-authenticate' />
        <p className='withdraw__text'>
            <Localize i18n_default_text='To protect your account, we need to authenticate withdrawals.' />
        </p>
        <Button
            className={classNames('btn--primary btn--primary--orange withdraw__verify-button', { 'btn--disabled': is_button_disabled })}
            is_disabled={is_button_disabled}
            classNameSpan='withdraw__verify-button-text'
            has_effect
            text={localize('Get authentication email')}
            onClick={() => { sendVerificationEmail(client_email); }}
        />
    </div>
);

SendEmail.propTypes = {
    client_email         : PropTypes.string,
    is_button_disabled   : PropTypes.bool,
    sendVerificationEmail: PropTypes.func,
};

const Withdraw = ({
    client_email,
    container_height,
    error_message,
    has_verification_token,
    is_verification_button_disabled,
    is_loading,
    onMount,
    sendVerificationEmail,
    withdraw_url,
}) => (
    <div className='withdraw'>
        {has_verification_token ?
            <CashierContainer
                className='withdraw'
                container_height={container_height}
                container_url={withdraw_url}
                error_message={error_message}
                is_loading={is_loading}
                onMount={onMount}
            />
            :
            <SendEmail
                client_email={client_email}
                sendVerificationEmail={sendVerificationEmail}
                is_button_disabled={is_verification_button_disabled}
            />
        }
    </div>
);

Withdraw.propTypes = {
    client_email    : PropTypes.string,
    container_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    error_message         : PropTypes.string,
    has_verification_token: PropTypes.bool,
    is_disabled           : PropTypes.bool,
    is_loading            : PropTypes.bool,
    onMount               : PropTypes.func,
    sendVerificationEmail : PropTypes.func,
    withdraw_url          : PropTypes.string,
};

export default connect(
    ({ client, modules }) => ({
        client_email                   : client.email,
        container_height               : modules.cashier.container_height,
        error_message                  : modules.cashier.error_message,
        has_verification_token         : modules.cashier.has_verification_token,
        is_verification_button_disabled: modules.cashier.is_verification_button_disabled,
        is_loading                     : modules.cashier.is_loading,
        onMount                        : modules.cashier.onMountWithdraw,
        sendVerificationEmail          : modules.cashier.sendVerificationEmail,
        withdraw_url                   : modules.cashier.container_urls.withdraw,
    })
)(Withdraw);
