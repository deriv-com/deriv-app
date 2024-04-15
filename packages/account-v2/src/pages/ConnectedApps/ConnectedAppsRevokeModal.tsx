import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';
import TrashIcon from '../../assets/connectedApps/ic-account-trash-can.svg';
import { ACCOUNT_MODAL_REF } from '../../constants';

type TConnectedAppsRevokeModalProps = {
    handleRevokeAccess: () => void;
    handleToggleModal: () => void;
    isModalOpen: boolean;
};

export const ConnectedAppsRevokeModal = ({
    handleRevokeAccess,
    handleToggleModal,
    isModalOpen,
}: TConnectedAppsRevokeModalProps) => {
    Modal.setAppElement(ACCOUNT_MODAL_REF);
    return (
        <Modal className='p-24 md:w-[440px] sm:w-[328px] h-auto rounded-default' isOpen={isModalOpen}>
            <Modal.Body className='flex flex-col justify-center items-center'>
                {/* TODO: Replace this svg with trashIcon when quill-icons is updated */}
                <TrashIcon height={128} width={128} />
                <Text align='center' as='p' weight='bold'>
                    Confirm revoke access
                </Text>
            </Modal.Body>
            <Modal.Footer className='mt-24 p-0 min-h-0 flex gap-x-8 justify-center' hideBorder>
                <Button
                    color='black'
                    onClick={handleToggleModal}
                    rounded='sm'
                    size='lg'
                    type='button'
                    variant='outlined'
                >
                    Back
                </Button>
                <Button color='primary' onClick={handleRevokeAccess} rounded='sm' size='lg'>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
