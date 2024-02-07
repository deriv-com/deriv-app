import React, { useCallback, useEffect } from 'react';
import ReactModal from 'react-modal';
import { TSteps } from 'src/components/ProgressBar/Stepper';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { DesktopProgressBar, MobileProgressBar } from '../../../components/ProgressBar';
import { CUSTOM_STYLES } from '../../../helpers/signupModalHelpers';
import { ACTION_TYPES, useSignupWizardContext } from '../../../providers/SignupWizardProvider';
import WizardScreens from './WizardScreens';
import './index.scss';

const FORM_PROGRESS_STEPS: TSteps = ['Account currency', 'Personal details', 'Address', 'Terms of use'];

/**
 * @name SignupWizard
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizard = () => {
    const { currentStep, dispatch, helpers, isWizardOpen, setIsWizardOpen } = useSignupWizardContext();
    const { isMobile } = useBreakpoint();
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);

    const handleClose = useCallback(() => {
        setIsWizardOpen(false);
        dispatch({ type: ACTION_TYPES.RESET });
        helpers.setStep(1);
    }, [dispatch, helpers, setIsWizardOpen]);

    return (
        <ReactModal isOpen={isWizardOpen} onRequestClose={handleClose} shouldCloseOnOverlayClick style={CUSTOM_STYLES}>
            <div className='bg-background-primary-base md:max-h-[717px] md:max-w-[1040px] h-screen w-screen md:rounded-800 flex overflow-hidden'>
                {!isMobile && (
                    <div className='min-w-[256px] bg-system-light-secondary-background p-1200'>
                        <Text as='p' className='font-bold pt-1600 pb-1200 text-300'>
                            Add a Deriv Account
                        </Text>
                        <DesktopProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />
                        <StandaloneXmarkBoldIcon
                            className='absolute cursor-pointer right-1200 top-1200'
                            onClick={handleClose}
                        />
                    </div>
                )}
                <div className='flex flex-col justify-between w-full'>
                    {isMobile && (
                        <MobileProgressBar
                            activeStep={currentStep}
                            onClickClose={handleClose}
                            steps={FORM_PROGRESS_STEPS}
                        />
                    )}
                    <WizardScreens />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
