import React from 'react';
import { Modal, Text } from '@deriv-com/ui';

type TAccountClosureSuccessModalProps = {
    handleClose: () => void;
    isModalOpen: boolean;
};

export const AccountClosureSuccessModal = ({ handleClose, isModalOpen }: TAccountClosureSuccessModalProps) => (
    <Modal
        className='p-24 w-[440px] sm:w-[312px]'
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
    >
        <Modal.Body className='flex flex-col'>
            <Text align='center' as='p' size='md' weight='bold'>
                We&apos;re sorry to see you leave.
            </Text>
            <Text align='center' as='p' size='md' weight='bold'>
                Your account is now closed.
            </Text>
        </Modal.Body>
    </Modal>
);
