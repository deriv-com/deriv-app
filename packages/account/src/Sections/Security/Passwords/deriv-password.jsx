import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';
import { toTitleCase } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';
import SentEmailModal from './sent-email-modal.jsx';

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
                                onClick={() => {
                                    toggleUnlinkModal(true);
                                    toggleSentEmailModal(true);
                                }}
                                type='button'
                                text={localize('Unlink')}
                                tertiary
                                large
                            />
                        </div>
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
                is_unlink_modal={is_unlink_modal_open}
                is_open={is_sent_email_modal_open}
                onClose={() => toggleSentEmailModal(false)}
                identifier_title={capitalize_identifier}
                onConfirm={() => onClickSendEmail()}
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
