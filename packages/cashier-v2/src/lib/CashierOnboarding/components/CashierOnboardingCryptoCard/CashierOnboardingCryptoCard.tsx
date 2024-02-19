import React from 'react';
import { onboardingCryptoCardIcons } from '../../constants/icons';
import { CashierOnboardingCard } from '../CashierOnboardingCard';
import { CashierOnboardingIconMarquee } from '../CashierOnboardingIconMarquee';

const CashierOnboardingCryptoCard: React.FC = () => {
    return (
        <CashierOnboardingCard description='We accept the following cryptocurrencies:' title='Deposit cryptocurrencies'>
            <CashierOnboardingIconMarquee icons={onboardingCryptoCardIcons.light} />
        </CashierOnboardingCard>
    );
};

export default CashierOnboardingCryptoCard;
