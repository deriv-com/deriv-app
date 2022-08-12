import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const InvalidVerificationLinkModal = ({
    is_invalid_verification_link_modal_open,
    onClickGetNewLinkButton,
    setIsInvalidVerificationLinkModalOpen,
    verification_link_expiry_time,
}) => {
    return (
        <Modal
            has_close_icon
            is_open={is_invalid_verification_link_modal_open}
            title=''
            toggleModal={() => setIsInvalidVerificationLinkModalOpen(false)}
            width='440px'
        >
            <Modal.Body className='invalid-verification-link-modal'>
                <Icon icon='IcEmailVerificationLinkInvalid' size='128' />
                <Text className='invalid-verification-link-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Invalid verification link' />
                </Text>
                <Text align='center' color='prominent' size='s'>
                    <Localize
                        i18n_default_text='The verification link becomes invalid after {{verification_link_expiry_time}} minutes. Hit the button below to request a new one.'
                        values={{ verification_link_expiry_time }}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer className='invalid-verification-link-modal--footer'>
                <Button large primary onClick={onClickGetNewLinkButton}>
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

InvalidVerificationLinkModal.propTypes = {
    is_invalid_verification_link_modal_open: PropTypes.bool,
    onClickGetNewLinkButton: PropTypes.func,
    setIsInvalidVerificationLinkModalOpen: PropTypes.func,
    verification_link_expiry_time: PropTypes.number,
};

export default InvalidVerificationLinkModal;
