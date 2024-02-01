import React from 'react';
import { useSignupWizardContext } from '../../../../providers/SignupWizardProvider';
import { Address, CurrencySelector, PersonalDetails, TermsOfUse } from '../../../../screens';

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
            return <PersonalDetails />;
        case 3:
            return <Address />;
        case 4:
            return <TermsOfUse />;
        default:
            return null;
    }
};

export default WizardScreens;
