import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize, localize } from 'Components/i18next';

const MyProfileBalanceModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext() || {};

    return (
        <Modal
            className='my-profile-balance-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={localize('Available Deriv P2P Balance')}
        >
            <Modal.Body className='my-profile-balance-modal__body'>
                <Text as='div' className='my-profile-balance-modal__body-text' size='xs'>
                    <Localize i18n_default_text='Your Deriv P2P balance only includes deposits that can’t be reversed.' />
                </Text>
                <Text size='xs'>
                    <Localize i18n_default_text='Deposits via cards and the following payment methods aren’t included: Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default MyProfileBalanceModal;
