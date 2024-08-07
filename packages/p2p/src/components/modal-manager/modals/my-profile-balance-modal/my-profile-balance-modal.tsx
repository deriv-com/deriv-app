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
            title={localize('Deriv P2P balance')}
        >
            <Modal.Body className='my-profile-balance-modal__body'>
                <Text as='div' className='my-profile-balance-modal__body-text' size='xs'>
                    <Localize i18n_default_text='Your Deriv P2P balance includes:' />
                </Text>
                <ol className='my-profile-balance-modal__body-list'>
                    <Text as='li' size='xs'>
                        <Localize i18n_default_text='P2P deposits: Funds received from buying USD from another Deriv P2P user.' />
                    </Text>
                    <Text as='li' size='xs'>
                        <Localize i18n_default_text='Non-reversible deposits: Deposits from non-reversible payment methods.' />
                    </Text>
                </ol>
                <Text as='div' size='xs' className='my-profile-balance-modal__body-note'>
                    <Localize i18n_default_text='Note: Funds deposited using reversible payment methods, like credit cards, Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR will not appear in your P2P balance.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default MyProfileBalanceModal;
