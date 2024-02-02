import React from 'react';
import { PlatformsDerivAppsLightIcon } from '@deriv/quill-icons';
import { TradingAccountCard, TradingAccountCardContent, TradingAccountCardLightButton } from '../TradingAccountCard';
import { useUIContext } from '../UIProvider';

const TrailingButton = () => {
    const { setUIState } = useUIContext();
    const handleOpenSignupWizard = () => {
        setUIState({ isSignupWizardOpen: true });
    };
    return <TradingAccountCardLightButton onSubmit={handleOpenSignupWizard} />;
};

const GetDerivAccount = () => {
    const title = 'Deriv account';

    const description = 'Get a real Deriv account, start trading and manage your funds.';

    return (
        <div className='grid grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            <TradingAccountCard
                leading={() => <PlatformsDerivAppsLightIcon height='60px' width='60px' />}
                trailing={TrailingButton}
            >
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default GetDerivAccount;
