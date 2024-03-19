import React from 'react';
import { StandaloneTriangleExclamationRegularIcon } from '@deriv/quill-icons';
import { Button, Modal, Text } from '@deriv-com/ui';

type TAccountClosureConfirmModalProps = {
    handleCancel: () => void;
    handleSubmit: () => void;
    isModalOpen: boolean;
};

export const AccountClosureConfirmModal = ({
    handleCancel,
    handleSubmit,
    isModalOpen,
}: TAccountClosureConfirmModalProps) => (
<<<<<<< HEAD
    <Modal className='p-24 md:w-[440px] sm:w-[312px]' isOpen={isModalOpen}>
=======
    <Modal className='p-24 w-[440px] sm:w-[312px]' isOpen={isModalOpen}>
>>>>>>> b05e4b4dcb ([account-v2]/likhith/COJ-667/Create account-closure-form and modal (#14208))
        <Modal.Body className='flex flex-col'>
            <StandaloneTriangleExclamationRegularIcon className='self-center fill-status-light-danger' iconSize='2xl' />
            <Text align='center' as='h4' size='md' weight='bold'>
                Close your account?
            </Text>
            <Text align='center' as='p' className='mt-24' size='sm'>
                Closing your account will automatically log you out. We shall delete your personal information as soon
                as our legal obligations are met.
            </Text>
        </Modal.Body>
        <Modal.Footer className='mt-24 flex gap-x-16 justify-end' hideBorder>
            <Button color='black' onClick={handleCancel} rounded='sm' size='md' type='button' variant='outlined'>
                Go back
            </Button>
            <Button color='primary' onClick={handleSubmit} rounded='sm' size='md'>
                Close account
            </Button>
        </Modal.Footer>
    </Modal>
);
