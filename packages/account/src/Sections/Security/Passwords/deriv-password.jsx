import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { toTitleCase } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';
import SentEmailModal from './sent-email-modal.jsx';

const UnlinkConfirmationModal = ({ is_open, onClose, onConfirm, identifier_title }) => (
    <Modal
        is_open={is_open}
        is_confirmation_modal
        has_close_icon={false}
        should_header_stick_body
        title={
            <Localize
                i18n_default_text='Are you sure you want to unlink from {{identifier_title}}?'
                values={{ identifier_title }}
            />
        }
        width='440px'
    >
        <Modal.Body>
            <Text size='xs'>{localize('You will need to set a password to complete the process.')}</Text>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
            <Button has_effect onClick={onConfirm} primary large>
                <Localize i18n_default_text='Unlink from {{identifier_title}}' values={{ identifier_title }} />
            </Button>
        </Modal.Footer>
    </Modal>
);

const DerivPassword = ({ email, is_dark_mode_on, is_social_signup, social_identity_provider }) => {
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

    const capitalize_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';

    const getSocialidentityProvider = () => {
        if (!social_identity_provider) return '';
        return (
            <React.Fragment>
                <Icon icon={`IcStock${capitalize_identifier}`} size={16} />
                <Text size='xs'>
                    <Localize
                        i18n_default_text='Linked with {{identifier_title}}'
                        values={{ identifier_title: capitalize_identifier }}
                    />
                </Text>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic is_dark_mode_on={is_dark_mode_on} is_deriv_password />
                {is_social_signup ? (
                    <React.Fragment>
                        <div className='account__passwords-item-right passwords-social-buttons'>
                            <div className='account__passwords-linked'>{getSocialidentityProvider()}</div>
                            <Button
                                className='account__passwords-footer-btn'
                                onClick={() => setIsUnlinkModalOpen(true)}
                                type='button'
                                text={localize('Unlink')}
                                tertiary
                                large
                            />
                        </div>
                        <UnlinkConfirmationModal
                            is_open={is_unlink_modal_open}
                            onClose={() => toggleUnlinkModal(false)}
                            onConfirm={() => onClickSendEmail()}
                            identifier_title={capitalize_identifier}
                        />
                    </React.Fragment>
                ) : (
                    <ChangePasswordForm
                        onClickSendEmail={() => {
                            WS.verifyEmail(email, 'reset_password');
                            toggleSentEmailModal(true);
                        }}
                    />
                )}
            </div>
            <SentEmailModal
                is_open={is_sent_email_modal_open}
                onClose={() => toggleSentEmailModal(false)}
                identifier_title={capitalize_identifier}
            />
        </React.Fragment>
    );
};

DerivPassword.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_social_signup: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default connect(({ client, ui }) => ({
    email: client.email,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_social_signup: client.is_social_signup,
    social_identity_provider: client.social_identity_provider,
}))(DerivPassword);
