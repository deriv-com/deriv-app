import React from 'react';
import { useHistory } from 'react-router-dom';
import { CashierOnboardingCard } from '../CashierOnboardingCard';

const CashierOnboardingPaymentAgentCard: React.FC = () => {
    const history = useHistory();
    return (
        <CashierOnboardingCard
            description='Deposit in your local currency via an authorised, independent payment agent in your country.'
            onClick={() => history.push('/cashier-v2/payment-agent')}
            title='Deposit via payment agents'
        />
    );
};

export default CashierOnboardingPaymentAgentCard;
