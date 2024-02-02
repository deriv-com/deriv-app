import React, { useState } from 'react';
import { PlatformsDerivAppsLightIcon } from '@deriv/quill-icons';
import RealAccountSignup from '../../flows/RealAccountSIgnup/SignupWizard';
import { TradingAccountCard, TradingAccountCardContent, TradingAccountCardLightButton } from '../TradingAccountCard';

const GetDerivAccount = () => {
    const [isSignupWizardOpen, setIsSignupWizardOpen] = useState(false);

    const title = 'Deriv account';

    const description = 'Get a real Deriv account, start trading and manage your funds.';

    return (
        <div className='grid grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            <TradingAccountCard
                leading={() => <PlatformsDerivAppsLightIcon height='60px' width='60px' />}
                trailing={() => <TradingAccountCardLightButton onSubmit={() => setIsSignupWizardOpen(true)} />}
            >
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
            <RealAccountSignup isOpen={isSignupWizardOpen} onClose={() => setIsSignupWizardOpen(false)} />
        </div>
    );
};

export default GetDerivAccount;
