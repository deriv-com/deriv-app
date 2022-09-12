import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const EmailLinkVerifiedModal = ({
    amount,
    currency,
    is_email_link_verified_modal_open,
    onClickConfirm,
    setIsEmailLinkVerifiedModalOpen,
}) => {
    return (
        <Modal
            has_close_icon
            is_open={is_email_link_verified_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => setIsEmailLinkVerifiedModalOpen(false)}
            width='440px'
        >
            <Modal.Body className='email-verified-modal'>
                <Icon icon='IcEmailVerificationLinkValid' size='128' />
                <Text className='email-verified-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text="We've verified your order" />
                </Text>
                <Text align='center' color='prominent' size='s'>
                    <Localize
                        i18n_default_text="Please ensure you've received {{amount}} {{currency}} in your account and hit Confirm to complete the transaction."
                        values={{ amount, currency }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='email-verified-modal--footer'>
                <Button
                    large
                    primary
                    onClick={() => {
                        setIsEmailLinkVerifiedModalOpen(false);
                        onClickConfirm();
                    }}
                >
                    <Localize i18n_default_text='Confirm' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

EmailLinkVerifiedModal.propTypes = {
    amount: PropTypes.string,
    currency: PropTypes.string,
    is_email_link_verified_modal_open: PropTypes.bool,
    onClickConfirm: PropTypes.func,
    setIsEmailLinkVerifiedModalOpen: PropTypes.func,
};

export default EmailLinkVerifiedModal;
