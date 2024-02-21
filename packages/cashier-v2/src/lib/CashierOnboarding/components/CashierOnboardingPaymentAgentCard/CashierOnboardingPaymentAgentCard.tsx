import React from 'react';
import { CashierOnboardingCard } from '../CashierOnboardingCard';

const CashierOnboardingPaymentAgentCard: React.FC = () => {
    return (
        <CashierOnboardingCard
            description='Deposit in your local currency via an authorised, independent payment agent in your country.'
            title='Deposit via payment agents'
        />
    );
};

export default CashierOnboardingPaymentAgentCard;
