import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

type TInvalidVerificationLinkModalProps = {
    error_message: string;
    order_id: string;
};

const InvalidVerificationLinkModal = ({ error_message, order_id }: TInvalidVerificationLinkModalProps) => {
    const { order_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { confirmOrderRequest } = order_store;

    return (
        <Modal has_close_icon is_open={is_modal_open} toggleModal={hideModal} width='440px'>
            <Modal.Body className='invalid-verification-link-modal'>
                <Icon icon='IcEmailVerificationLinkInvalid' size='128' />
                <Text className='invalid-verification-link-modal__text' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Invalid verification link' />
                </Text>
                <Text align='center' color='prominent'>
                    {error_message}
                </Text>
            </Modal.Body>
            <Modal.Footer className='invalid-verification-link-modal__footer'>
                <Button
                    large
                    primary
                    onClick={() => {
                        hideModal();
                        confirmOrderRequest(order_id);
                    }}
                >
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvalidVerificationLinkModal;
