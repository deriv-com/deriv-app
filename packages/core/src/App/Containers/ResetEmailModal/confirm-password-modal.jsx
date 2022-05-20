import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { SentEmailModal } from '@deriv/account';
import { WS } from 'Services';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';

export const ConfirmPasswordModal = ({ onClose, is_open, prevEmail, curEmail, verification_code }) => {
    const [email_request, setEmailRequest] = React.useState(null);
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);
    const [is_error, set_is_error] = React.useState(false);
    const [error_message, set_error_message] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(is_open);

    const onResetComplete = error_msg => {
        // Error would be returned on invalid token (and the like) cases.
        if (error_msg) {
            set_is_error(true);
            return;
        }

        setIsOpen(!is_open);
        setIsSendEmailModalOpen(true);
        set_error_message(error_msg);
        // toggleResetEmailModal(false);
    };

    const handleSubmit = actions => {
        const api_request = {
            change_email: 'verify',
            new_email: curEmail,
            verification_code,
        };

        setEmailRequest(api_request);

        WS.changeEmail(api_request).then(async response => {
            if (response.error) {
                onResetComplete(response.error.message);
            } else {
                onResetComplete(null, actions);
            }
        });
    };

    const resendEmail = () => {
        WS.changeEmail(email_request);
    };

    if (is_send_email_modal_open) {
        return (
            <SentEmailModal
                is_open={is_send_email_modal_open}
                onClose={() => setIsSendEmailModalOpen(false)}
                identifier_title={'Change_Email'}
                onClickSendEmail={resendEmail}
                has_live_chat={true}
                is_modal_when_mobile={true}
            />
        );
    }
    return (
        <Modal
            is_open={isOpen}
            should_header_stick_body
            title={<Localize i18n_default_text='Are you sure?' />}
            toggleModal={onClose}
            width='440px'
        >
            {is_error ? <p>{error_message}</p> : null}
            <React.Fragment>
                <div className='email-confirmation'>
                    <Text as='p' color='prominent' size='xs' align='left'>
                        <Localize
                            i18n_default_text='Are you sure you want to update email <0>{{prevEmail}}</0> to <1>{{curEmail}}</1>?'
                            values={{ curEmail, prevEmail }}
                            components={[
                                <span key={0} className='email-confirmation__prevEmail' />,
                                <span key={1} className='email-confirmation__currentEmail' />,
                            ]}
                        />
                    </Text>
                </div>

                <Modal.Footer>
                    <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
                    <Button
                        className='email-change_button'
                        has_effect
                        onClick={() => {
                            handleSubmit();
                        }}
                        primary
                        large
                    >
                        <Localize i18n_default_text='Confirm' />
                    </Button>
                </Modal.Footer>
            </React.Fragment>
        </Modal>
    );
};

ConfirmPasswordModal.propTypes = {
    email: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    onClose: PropTypes.func,
    is_open: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    email: client.email,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_email_modal_visible,
    logoutClient: client.logout,
    toggleResetEmailModal: ui.toggleResetEmailModal,
    verification_code: client.verification_code.request_email,
}))(ConfirmPasswordModal);
