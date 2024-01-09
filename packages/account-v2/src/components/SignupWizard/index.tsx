import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { useSignupWizardContext } from '../../context/SignupWizardContext';
import Actions from './Actions';
import { CUSTOM_STYLES } from './helpers';
import './index.scss';

const SignupWizard: React.FC = () => {
    const {
        currentStep,
        helpers: { goToNextStep },
        setIsWizardOpen,
    } = useSignupWizardContext();
    useEffect(() => {
        ReactModal.setAppElement('#v2_modal_root');
    }, []);
    return (
        <ReactModal
            isOpen
            onRequestClose={() => setIsWizardOpen(false)}
            shouldCloseOnOverlayClick
            style={CUSTOM_STYLES}
        >
            <div className='bg-background-primary-base h-[71.7rem] w-[104rem] rounded-800 flex overflow-hidden'>
                <div className='min-w-[25.6rem] bg-[#f2f3f4] p-800'>Timeline</div>
                <div className='flex flex-col p-800 w-[100%] justify-between'>
                    <StandaloneXmarkBoldIcon
                        className='cursor-pointer absolute right-1200 top-1200'
                        fill='#000000'
                        onClick={() => setIsWizardOpen(false)}
                    />
                    Current step: {currentStep}
                    <Actions onSubmit={goToNextStep} />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
