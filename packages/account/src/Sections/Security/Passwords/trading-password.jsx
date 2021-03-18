import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';
import SentEmailModal from './sent-email-modal.jsx';

const TradingPassword = ({ email }) => {
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const toggleSentEmailModal = (state_change = !is_sent_email_modal_open) => {
        setIsSentEmailModalOpen(!!state_change);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Trading password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic />
                <ChangePasswordForm
                    onClickSendEmail={() => {
                        WS.verifyEmail(email, 'reset_password');
                        toggleSentEmailModal(true);
                    }}
                />
            </div>
            <SentEmailModal is_open={is_sent_email_modal_open} onClose={() => toggleSentEmailModal(false)} />
        </React.Fragment>
    );
};

TradingPassword.propTypes = {
    email: PropTypes.string,
};

export default connect(({ client }) => ({
    email: client.email,
}))(TradingPassword);
