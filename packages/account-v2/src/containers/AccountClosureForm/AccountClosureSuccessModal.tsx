import React from 'react';
import { Modal, Text } from '@deriv-com/ui';

type TAccountClosureSuccessModalProps = {
    handleClose: () => void;
    isModalOpen: boolean;
};

export const AccountClosureSuccessModal = ({ handleClose, isModalOpen }: TAccountClosureSuccessModalProps) => (
    <Modal
<<<<<<< HEAD
        className='p-24 md:w-[440px] sm:w-[312px]'
=======
        className='p-24 w-[440px] sm:w-[312px]'
>>>>>>> b05e4b4dcb ([account-v2]/likhith/COJ-667/Create account-closure-form and modal (#14208))
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
