import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { SentEmailModal } from '@deriv/account';
import { WS } from 'Services';
import PropTypes from 'prop-types';

export const ConfirmEmailModal = ({
    onClose,
    is_open,
    prev_Email,
    new_Email,
    verification_code,
    setEmailError,
    setErrorMessage,
}) => {
    const [email_request, setEmailRequest] = React.useState(null);
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);
    const [is_modal_open, setIsModalOpen] = React.useState(is_open);

    const handleSubmit = () => {
        const api_request = {
            change_email: 'verify',
            new_email: new_Email,
            verification_code,
        };

        setEmailRequest(prev => ({ ...prev, ...api_request }));

        WS.changeEmail(api_request).then(response => {
            if (response.error) {
                setEmailError(true);
                onClose();
                setErrorMessage(response.error.message);
            } else {
                setIsSendEmailModalOpen(true);
            }
            setIsModalOpen(false);
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
            is_open={is_modal_open}
            should_header_stick_body
            title={<Localize i18n_default_text='Are you sure?' />}
            toggleModal={onClose}
            width='440px'
        >
            <React.Fragment>
                <div className='email-confirmation'>
                    <Text as='p' color='prominent' size='xs' align='left'>
                        <Localize
                            i18n_default_text='Are you sure you want to update email <0>{{prev_Email}}</0> to <1>{{new_Email}}</1>?'
                            values={{ prev_Email, new_Email }}
                            components={[
                                <strong key={0} />,
                                <strong key={1} className='email-confirmation__currentEmail' />,
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

ConfirmEmailModal.propTypes = {
    onClose: PropTypes.func,
    is_open: PropTypes.bool,
    verification_code: PropTypes.string,
    prev_Email: PropTypes.string,
    new_Email: PropTypes.string,
    setEmailError: PropTypes.func,
    setErrorMessage: PropTypes.func,
};
