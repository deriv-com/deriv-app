import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import UnsavedChanges from '../../assets/status-message/ic-unsaved-changes.svg';

type TLeaveConfirm = {
    onCancel?: () => void;
    onLeave?: () => void;
};

export const LeaveConfirm = ({ onCancel, onLeave }: TLeaveConfirm) => {
    const history = useHistory();
    const { dirty } = useFormikContext();
    const { isMobile } = useDevice();

    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const unblock = useRef<ReturnType<ReturnType<typeof useHistory>['block']>>();

    useEffect(() => {
        unblock.current = history.block((prompt: { pathname: React.SetStateAction<string> }) => {
            if (dirty) {
                setCurrentPath(prompt.pathname);
                setShowPrompt(true);
            }
            return !dirty;
        });
        return () => {
            unblock.current();
        };
    }, [dirty, history]);

    const handleLeave = useCallback(() => {
        onLeave?.();
        unblock.current();
        setShowPrompt(false);
        history.push(currentPath);
    }, [currentPath, history, onLeave]);

    const handleCancel = useCallback(async () => {
        onCancel?.();
        setShowPrompt(false);
    }, [onCancel]);

    return (
        <Modal className='w-[440px]' isOpen={showPrompt}>
            <div className='grid justify-center w-full gap-20 p-48 lg:p-24 justify-items-center'>
                <UnsavedChanges />
                <div className='grid justify-center gap-10'>
                    <Text align='center' size='md' weight='bold'>
                        Unsaved Changes
                    </Text>
                    <div className='grid gap-4'>
                        <Text align='center' size='sm'>
                            You have unsaved changes. Are you sure you want to discard changes and leave this page?
                        </Text>
                    </div>
                </div>
                <div className='flex flex-col justify-center w-full gap-8 mt-24 lg:flex-row'>
                    <Button isFullWidth={isMobile} onClick={handleCancel} type='button' variant='outlined'>
                        Cancel
                    </Button>
                    <Button isFullWidth={isMobile} onClick={handleLeave} type='button'>
                        Leave Settings
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
