import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { useSignupWizardContext } from '../../context/SignupWizardContext';
import { CUSTOM_STYLES } from '../../helpers/signupModalHelpers';
import { stepProgress } from '../../mocks/form-progress.mock';
import CurrencySelector from '../../pages/CurrencySelector';
import { FormProgress } from '../form-progress';
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

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (currentStep) {
        case 1:
            return <CurrencySelector />;
        case 2:
            return <CurrencySelector />;
        case 3:
            return <CurrencySelector />;
        case 4:
            return <CurrencySelector />;
        default:
            return null;
    }
};

/**
 * @name SignupWizard
 * @description The SignupWizard component is used to render the signup wizard modal.
 * @example
 * return (
 *  <SignupWizard />
 * );
 */
const SignupWizard: React.FC = () => {
    const { currentStep, isWizardOpen, setIsWizardOpen } = useSignupWizardContext();
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    return (
        <ReactModal
            isOpen={isWizardOpen}
            onRequestClose={() => setIsWizardOpen(false)}
            shouldCloseOnOverlayClick
            style={CUSTOM_STYLES}
        >
            <div className='bg-background-primary-base h-[717px] w-[1040px] rounded-800 flex overflow-hidden'>
                <div className='min-w-[25.6rem] bg-[#f2f3f4] p-800'>
                    <FormProgress activeStep={currentStep} steps={stepProgress} />
                </div>
                <div className='flex flex-col w-[100%] justify-between'>
                    <StandaloneXmarkBoldIcon
                        className='absolute cursor-pointer right-1200 top-1200'
                        onClick={() => setIsWizardOpen(false)}
                    />

                    <WizardScreens />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
