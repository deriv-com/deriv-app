import React from 'react';
import { onboardingFiatCardIcons } from '../../constants/icons';
import { CashierOnboardingCard } from '../CashierOnboardingCard';
import { CashierOnboardingIconMarquee } from '../CashierOnboardingIconMarquee';

const CashierOnboardingFiatCard: React.FC = () => {
    return (
        <CashierOnboardingCard
            description='Deposit via the following payment methods:'
            title='Deposit via bank wire, credit card, and e-wallet'
        >
            <CashierOnboardingIconMarquee icons={onboardingFiatCardIcons.light} />
        </CashierOnboardingCard>
    );
};

export default CashierOnboardingFiatCard;
