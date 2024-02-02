import React from 'react';
import { SignupWizardProvider } from '../../../providers/SignupWizardProvider';
import SignupWizardModal from './SignupWizardModal';
import './index.scss';

type TRealAccountSignupFlow = {
    isOpen: boolean;
    onClose: VoidFunction;
};

/**
 * @name RealAccountSignup
 * @description The RealAccountSignup component is used to render the real account signup flow.
 * @example
 * return (
 *    <RealAccountSignup isOpen={isOpen} onClose={handleClose} />
 * );
 */
const RealAccountSignup = ({ isOpen, onClose }: TRealAccountSignupFlow) => {
    return (
        <SignupWizardProvider>
            <SignupWizardModal isOpen={isOpen} onClose={onClose} />
        </SignupWizardProvider>
    );
};

export default RealAccountSignup;
