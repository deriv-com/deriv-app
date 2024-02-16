import React from 'react';
import { useSignupWizardContext } from '../../providers/SignupWizardProvider';
import { PlatformIcon } from '../PlatformIcon';
import { TradingAccountCard, TradingAccountCardContent, TradingAccountCardLightButton } from '../TradingAccountCard';

const TrailingButton = () => {
    const { setIsWizardOpen } = useSignupWizardContext();
    return <TradingAccountCardLightButton onSubmit={() => setIsWizardOpen(true)} />;
};

const LeadingIcon = () => <PlatformIcon icon='DerivApps' width={60} />;

const GetDerivAccount = () => {
    const title = 'Deriv account';

    const description = 'Get a real Deriv account, start trading and manage your funds.';

    return (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-x-24 lg:gap-y-4'>
            <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default GetDerivAccount;
