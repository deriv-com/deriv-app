import React from 'react';
import ReactModal from 'react-modal';
import { Button, Text } from '@deriv-com/ui';
import { CUSTOM_STYLES } from '../../../helpers/signupModalHelpers';
import { ACTION_TYPES, useSignupWizardContext } from '../../../providers/SignupWizardProvider';

const ExitConfirmationDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { dispatch, helpers, setIsWizardOpen } = useSignupWizardContext();

    const handleClose = () => {
        onClose();
        setIsWizardOpen(false);
        dispatch({ type: ACTION_TYPES.RESET });
        helpers.setStep(1);
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
                    <Button onClick={handleClose} variant='outlined'>
                        Yes
                    </Button>
                    <Button onClick={onClose}>No</Button>
                </div>
            </div>
        </ReactModal>
    );
};

export default ExitConfirmationDialog;
