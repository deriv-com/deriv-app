import React from 'react';
import { AccountsDerivAccountLightIcon } from '@deriv/quill-icons';
import { useSignupWizardContext } from '../../providers/SignupWizardProvider';
import { TradingAccountCard, TradingAccountCardContent, TradingAccountCardLightButton } from '../TradingAccountCard';

const TrailingButton = () => {
    const { setIsWizardOpen } = useSignupWizardContext();
    return <TradingAccountCardLightButton onSubmit={() => setIsWizardOpen(true)} />;
};

const LeadingIcon = () => <AccountsDerivAccountLightIcon height='80px' width='80px' />;

const GetDerivAccount = () => {
    const title = 'Deriv account';

    const description = 'Get a real Deriv account, start trading and manage your funds.';

    return (
        <div className='grid grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default GetDerivAccount;
