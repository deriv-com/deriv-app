import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';
import { toTitleCase } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import UnlinkModal from 'Components/unlink-modal';
import ChangePasswordForm from './change-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';

const DerivPassword = ({ email, is_social_signup, social_identity_provider }) => {
    const [is_unlink_modal_open, setIsUnlinkModalOpen] = React.useState(false);
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'reset_password');
        setIsUnlinkModalOpen(false);
    };

    const capitalized_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic is_deriv_password />
                {is_social_signup ? (
                    <React.Fragment>
                        <div className='account__passwords-item-right passwords-social-buttons'>
                            <div className='account__passwords-linked'>
                                {social_identity_provider ? (
                                    <React.Fragment>
                                        <Icon icon={`IcStock${capitalized_identifier}`} size={16} />
                                        <Text size='xs'>
                                            <Localize
                                                i18n_default_text='Linked with {{identifier_title}}'
                                                values={{ identifier_title: capitalized_identifier }}
                                            />
                                        </Text>
                                    </React.Fragment>
                                ) : (
                                    ''
                                )}
                            </div>
                            <Button
                                className='account__passwords-footer-btn'
                                onClick={() => {
                                    setIsUnlinkModalOpen(true);
                                    setIsSentEmailModalOpen(true);
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
                            setIsSentEmailModalOpen(true);
                        }}
                    />
                )}
                <UnlinkModal
                    is_open={is_unlink_modal_open}
                    onClose={() => {
                        setIsUnlinkModalOpen(false);
                        setIsSentEmailModalOpen(false);
                    }}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open && !is_unlink_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                />
            </div>
        </React.Fragment>
    );
};

DerivPassword.propTypes = {
    email: PropTypes.string,
    is_social_signup: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default connect(({ client }) => ({
    email: client.email,
    is_social_signup: client.is_social_signup,
    social_identity_provider: client.social_identity_provider,
}))(DerivPassword);
