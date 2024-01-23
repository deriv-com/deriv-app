import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { useSignupWizardContext } from '../../context/SignupWizardContext';
import CurrencySelector from '../../pages/CurrencySelector';
import { CUSTOM_STYLES } from './helpers';
import './index.scss';

const WizardScreens = () => {
    const { currentStep } = useSignupWizardContext();

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (currentStep) {
        case 1:
            return <CurrencySelector />;
        default:
            return null;
    }
};

const SignupWizard: React.FC = () => {
    const { isWizardOpen, setIsWizardOpen } = useSignupWizardContext();
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
            <div className='bg-background-primary-base h-[71.7rem] w-[104rem] rounded-800 flex overflow-hidden'>
                <div className='min-w-[25.6rem] bg-[#f2f3f4] p-800'>Timeline</div>
                <div className='flex flex-col w-[100%] justify-between'>
                    <StandaloneXmarkBoldIcon
                        className='cursor-pointer absolute right-1200 top-1200'
                        onClick={() => setIsWizardOpen(false)}
                    />

                    <WizardScreens />
                </div>
            </div>
        </ReactModal>
    );
};

export default SignupWizard;
