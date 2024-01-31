import React, { useCallback, useEffect } from 'react';
import ReactModal from 'react-modal';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { ProgressBar } from '../../../components/ProgressBar';
import { CUSTOM_STYLES } from '../../../helpers/signupModalHelpers';
import { ACTION_TYPES, useSignupWizardContext } from '../../../providers/SignupWizardProvider';
import CurrencySelector from '../../../screens/CurrencySelector';
import './index.scss';

/**
 * @name WizardScreens
 * @description The WizardScreens component is used to render the screens in the SignupWizard component based on the active step from `SignupWizardContext`.
 * @example
 * return (
 *   <WizardScreens />
 * );
 */
const WizardScreens = () => {
    const { currentStep } = useSignupWizardContext();

    switch (currentStep) {
        case 1:
            return <CurrencySelector />;
        case 2:
            return <div>Page 2</div>;
        case 3:
            return <div>Page 3</div>;
        case 4:
            return <div>Page 4</div>;
        default:
            return null;
    }
};

const FORM_TIMELINE_STEPS = [
    { isFilled: true, title: 'Step 1' },
    { isFilled: true, title: 'Step 2' },
    { isFilled: false, title: 'Step 3' },
    { isFilled: false, title: 'Step 4' },
];

/**
 * @name SignupWizard
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizard: React.FC = () => {
    const { currentStep, dispatch, helpers, isWizardOpen, setIsWizardOpen } = useSignupWizardContext();
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);

    const handleClose = useCallback(() => {
        setIsWizardOpen(false);
        dispatch({ payload: {}, type: ACTION_TYPES.RESET });
        helpers.setStep(1);
    }, [dispatch, helpers, setIsWizardOpen]);

    return (
        <ReactModal isOpen={isWizardOpen} onRequestClose={handleClose} shouldCloseOnOverlayClick style={CUSTOM_STYLES}>
            <div className='bg-background-primary-base h-[717px] w-[1040px] rounded-800 flex overflow-hidden'>
                <div className='min-w-[256px] bg-system-light-secondary-background p-800'>
                    <ProgressBar activeStep={currentStep} steps={FORM_TIMELINE_STEPS} />
                </div>
                <div className='flex flex-col justify-between w-full'>
                    <StandaloneXmarkBoldIcon
                        className='absolute cursor-pointer right-1200 top-1200'
                        onClick={handleClose}
                    />

                    <WizardScreens />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
