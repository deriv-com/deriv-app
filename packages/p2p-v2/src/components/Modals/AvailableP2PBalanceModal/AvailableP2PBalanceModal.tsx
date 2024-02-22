import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './AvailableP2PBalanceModal.scss';

type TAvailableP2PBalanceModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const AvailableP2PBalanceModal = ({ isModalOpen, onRequestClose }: TAvailableP2PBalanceModalProps) => {
    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    return (
        <Modal
            className='p2p-v2-available-p2p-balance-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
            testId='dt_p2p_v2_available_p2p_balance_modal'
        >
            <Text as='p' weight='bold'>
                Available Deriv P2P Balance
            </Text>
            <Text as='p' className='p2p-v2-block-unblock-user-modal__text' size='sm'>
                Your Deriv P2P balance only includes deposits that can’t be reversed.
            </Text>
            <Text as='p' className='p2p-v2-block-unblock-user-modal__text' size='sm'>
                Deposits via cards and the following payment methods aren’t included: Maestro, Diners Club, ZingPay,
                Skrill, Neteller, Ozow, and UPI QR.
            </Text>
            <div className='p2p-v2-block-unblock-user-modal__footer'>
                <Button onClick={onRequestClose} size='lg' textSize='sm'>
                    Ok
                </Button>
            </div>
        </Modal>
    );
};

export default AvailableP2PBalanceModal;
