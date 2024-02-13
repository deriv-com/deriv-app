import React from 'react';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { useSignupWizardContext } from '@/providers/SignupWizardProvider';

const AccountOpeningSuccessModal = () => {
    const { isSuccessModalOpen, setIsSuccessModalOpen } = useSignupWizardContext();

    return (
        <ReactModal
            ariaHideApp={false}
            className='modal'
            isOpen={false}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
            style={CUSTOM_STYLES}
        >
            <div className='w-[200px] h-[200px] bg-system-light-primary-background'>
                <div>
                    <h2>Account Opening Success</h2>
                </div>
                <div>
                    <p>Your account has been successfully opened.</p>
                </div>
                <div>
                    <button onClick={() => setIsSuccessModalOpen(false)}>Close</button>
                </div>
            </div>
        </ReactModal>
    );
};

export default AccountOpeningSuccessModal;
