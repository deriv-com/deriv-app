import React from 'react';
import { useRealAccountCreationContext } from '@/providers';
import { Address, CurrencySelector, PersonalDetails, TermsOfUse } from '@/screens';

/**
 * @name WizardScreens
 * @description The WizardScreens component is used to render the screens in the RealAccountCreation component based on the active step from `RealAccountCreationContext`.
 * @example
 * return (
 *   <WizardScreens />
 * );
 */
const WizardScreens = () => {
    const { currentStep } = useRealAccountCreationContext();

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
