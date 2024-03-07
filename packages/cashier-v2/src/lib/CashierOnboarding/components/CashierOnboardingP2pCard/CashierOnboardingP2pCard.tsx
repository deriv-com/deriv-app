import React from 'react';
import { CashierOnboardingCard } from '../CashierOnboardingCard';

const CashierOnboardingP2PCard: React.FC = () => {
    return (
        <CashierOnboardingCard
            description='Deposit with your local currency via peer-to-peer exchange with fellow traders in your country.'
            title='Deposit with Deriv P2P'
        />
    );
};

export default CashierOnboardingP2PCard;
