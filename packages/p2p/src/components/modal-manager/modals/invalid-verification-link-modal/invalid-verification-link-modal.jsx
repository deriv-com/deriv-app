import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const InvalidVerificationLinkModal = ({
    error_message,
    order_id,
    // TODO: Uncomment when time is available in BE response
    // verification_link_expiry_time,
}) => {
    const { order_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon is_open={is_modal_open} renderTitle={() => <></>} toggleModal={hideModal} width='440px'>
            <Modal.Body className='invalid-verification-link-modal'>
                <Icon icon='IcEmailVerificationLinkInvalid' size='128' />
                <Text className='invalid-verification-link-modal--text' color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Invalid verification link' />
                </Text>
                <Text align='center' color='prominent' size='s'>
                    {error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer className='invalid-verification-link-modal--footer'>
                <Button
                    large
                    primary
                    onClick={() => {
                        hideModal();
                        order_store.confirmOrderRequest(order_id);
                    }}
                >
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

InvalidVerificationLinkModal.propTypes = {
    error_message: PropTypes.string,
    order_id: PropTypes.string,
    // TODO: Uncomment when time is available in BE response
    // verification_link_expiry_time: PropTypes.number,
};

export default InvalidVerificationLinkModal;
