import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import SocialPasswordForm from './social-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';
import SentEmailModal from './sent-email-modal.jsx';

const UnlinkConfirmationModal = ({ is_open, onClose, onConfirm }) => (
    <Modal
        is_open={is_open}
        is_confirmation_modal
        has_close_icon={false}
        should_header_stick_body
        title={localize('Are you sure you want to unlink from Google?')}
        width='440px'
    >
        <Modal.Body>
            <Text size='xs'>{localize('You will need to set a password to complete the process.')}</Text>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
            <Button has_effect onClick={onConfirm} text={localize('Unlink from Google')} primary large />
        </Modal.Footer>
    </Modal>
);

const DerivPassword = ({ email, is_dark_mode_on, is_social_signup }) => {
    const [is_unlink_modal_open, setIsUnlinkModalOpen] = React.useState(false);
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const toggleUnlinkModal = (state_change = !is_unlink_modal_open) => {
        setIsUnlinkModalOpen(!!state_change);
    };

    const toggleSentEmailModal = (state_change = !is_sent_email_modal_open) => {
        setIsSentEmailModalOpen(!!state_change);
    };

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'reset_password');
        toggleUnlinkModal(false);
        toggleSentEmailModal(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic is_dark_mode_on={is_dark_mode_on} is_deriv_password />
                {is_social_signup ? (
                    <SocialPasswordForm setIsUnlinkModalOpen={setIsUnlinkModalOpen} />
                ) : (
                    <ChangePasswordForm
                        onClickSendEmail={() => {
                            WS.verifyEmail(email, 'reset_password');
                            toggleSentEmailModal(true);
                        }}
                    />
                )}
            </div>
            <UnlinkConfirmationModal
                is_open={is_unlink_modal_open}
                onClose={() => toggleUnlinkModal(false)}
                onConfirm={() => onClickSendEmail()}
            />
            <SentEmailModal is_open={is_sent_email_modal_open} onClose={() => toggleSentEmailModal(false)} />
        </React.Fragment>
    );
};

DerivPassword.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_social_signup: PropTypes.bool,
};

export default connect(({ client, ui }) => ({
    email: client.email,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_social_signup: client.is_social_signup,
}))(DerivPassword);
