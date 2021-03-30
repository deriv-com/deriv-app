import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import SetPasswordForm from './set-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';
import SentEmailModal from './sent-email-modal.jsx';

const TradingPassword = ({ email, is_trading_password_required }) => {
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'trading_platform_password_reset');
        setIsSentEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Trading password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic is_trading_password_required={is_trading_password_required} />
                {is_trading_password_required ? (
                    <SetPasswordForm />
                ) : (
                    <ChangePasswordForm is_trading_password onClickSendEmail={onClickSendEmail} />
                )}
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    identifier_title='trading_password'
                    onClose={() => setIsSentEmailModalOpen(false)}
                    onClickSendEmail={onClickSendEmail}
                />
            </div>
        </React.Fragment>
    );
};

TradingPassword.propTypes = {
    email: PropTypes.string,
    is_trading_password_required: PropTypes.bool,
};

export default connect(({ client }) => ({
    email: client.email,
    is_trading_password_required: client.is_trading_password_required,
}))(TradingPassword);
