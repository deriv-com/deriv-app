import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { ProgressBar } from '../../../components/ProgressBar';
import { CUSTOM_STYLES } from '../../../helpers/signupModalHelpers';
import { useSignupWizardContext } from '../../../providers/SignupWizardProvider';
import ExitConfirmationDialog from '../ExitConfirmationDialog';
import WizardScreens from './WizardScreens';
import './index.scss';

const FORM_PROGRESS_STEPS = [
    { isFilled: false, title: 'Account currency' },
    { isFilled: false, title: 'Personal details' },
    { isFilled: false, title: 'Address' },
    { isFilled: false, title: 'Terms of use' },
];

/**
 * @name SignupWizard
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizard = () => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const { currentStep, isWizardOpen } = useSignupWizardContext();
    const { isMobile } = useBreakpoint();

    return (
        <>
            <ReactModal
                ariaHideApp={false}
                isOpen={isWizardOpen}
                onRequestClose={() => setIsConfirmationDialogOpen(true)}
                shouldCloseOnOverlayClick={false}
                style={CUSTOM_STYLES}
            >
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
                                onClick={() => setIsConfirmationDialogOpen(true)}
                            />
                        )}
                        {isMobile && <ProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />}
                        <WizardScreens />
                    </div>
                </div>
            </ReactModal>
            <ExitConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
            />
        </>
    );
};

export default SignupWizard;
