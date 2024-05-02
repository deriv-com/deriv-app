import React from 'react';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { useRealAccountCreationContext } from '@/providers';
import { Button, Text } from '@deriv-com/ui';

const ExitConfirmationDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { reset } = useRealAccountCreationContext();
    const { closeModal } = useQueryParams();

    const handleClose = () => {
        onClose();
        closeModal();
        reset();
    };

    return (
        <ReactModal ariaHideApp={false} isOpen={isOpen} shouldCloseOnOverlayClick={false} style={CUSTOM_STYLES}>
            <div className='w-[calc(100vw-24px)] md:w-[440px] bg-system-light-primary-background p-24 rounded-default flex justify-between flex-col gap-24'>
                <Text as='p' weight='bold'>
                    Stop creating an account?
                </Text>
                <Text as='p' size='sm'>
                    If you hit Yes, the info you entered will be lost.
                </Text>
                <div className='flex justify-end gap-8'>
                    <Button color='black' onClick={handleClose} variant='outlined'>
                        Yes
                    </Button>
                    <Button onClick={onClose}>No</Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default ExitConfirmationDialog;
