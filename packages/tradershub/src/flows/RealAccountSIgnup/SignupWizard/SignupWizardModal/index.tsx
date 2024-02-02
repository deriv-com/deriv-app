import React, { useCallback, useEffect } from 'react';
import ReactModal from 'react-modal';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { ProgressBar } from '../../../../components/ProgressBar';
import { CUSTOM_STYLES } from '../../../../helpers/signupModalHelpers';
import { ACTION_TYPES, useSignupWizardContext } from '../../../../providers/SignupWizardProvider';
import WizardScreens from '../WizardScreens';

const FORM_PROGRESS_STEPS = [
    { isFilled: false, title: 'Account currency' },
    { isFilled: false, title: 'Personal details' },
    { isFilled: false, title: 'Address' },
    { isFilled: false, title: 'Terms of use' },
];

type TSignupWizardModal = {
    isOpen: boolean;
    onClose: VoidFunction;
};

/**
 * @name SignupWizardModal
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizardModal = ({ isOpen, onClose }: TSignupWizardModal) => {
    const { currentStep, dispatch, helpers } = useSignupWizardContext();
    const { isMobile } = useBreakpoint();
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);

    const handleClose = useCallback(() => {
        onClose();
        dispatch({ type: ACTION_TYPES.RESET });
        helpers.setStep(1);
    }, [dispatch, helpers, onClose]);

    return (
        <ReactModal isOpen={isOpen} onRequestClose={handleClose} shouldCloseOnOverlayClick style={CUSTOM_STYLES}>
            <div className='bg-background-primary-base md:max-h-[717px] md:max-w-[1040px] h-screen w-screen md:rounded-800 flex overflow-hidden'>
                {!isMobile && (
                    <div className='min-w-[256px] bg-system-light-secondary-background p-1200'>
                        <Text as='p' className='font-bold pt-1600 pb-1200 text-300'>
                            Add a Deriv Account
                        </Text>
                        <ProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />
                    </div>
                )}
                <div className='flex flex-col justify-between w-full'>
                    {!isMobile && (
                        <StandaloneXmarkBoldIcon
                            className='absolute cursor-pointer right-1200 top-1200'
                            onClick={handleClose}
                        />
                    )}
                    {isMobile && <ProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />}
                    <WizardScreens />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizardModal;
