import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const EmailLinkExpiredModal = () => {
    const { order_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { confirmOrderRequest, order_information } = order_store;

    const onClickHandler = () => {
        hideModal({ should_hide_all_modals: true });
        confirmOrderRequest(order_information.id);
    };

    return (
        <Modal
            className='email-link-expired-modal'
            has_close_icon
            is_open={is_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => hideModal({ should_hide_all_modals: true })}
            width='440px'
        >
            <Modal.Body className='email-link-expired-modal__body'>
                <Icon icon='IcEmailSentExpired' size='128' />
                <Text align='center' className='email-link-expired-modal__text' color='prominent' weight='bold'>
                    <Localize i18n_default_text='The verification link appears to be invalid. Hit the button below to request for a new one' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='email-link-expired-modal__footer'>
                <Button large primary onClick={onClickHandler}>
                    <Localize i18n_default_text='Get new link' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmailLinkExpiredModal;
