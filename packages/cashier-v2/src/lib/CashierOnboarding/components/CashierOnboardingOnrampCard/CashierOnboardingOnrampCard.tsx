import React from 'react';
import { useActiveAccount } from '@deriv/api';
import { onboardingOnrampIcons } from '../../constants/icons';
import { CashierOnboardingCard } from '../CashierOnboardingCard';
import { CashierOnboardingIconMarquee } from '../CashierOnboardingIconMarquee';

const CashierOnboardingOnrampCard: React.FC = () => {
    const { data: activeAccount } = useActiveAccount();

    return (
        <CashierOnboardingCard
            description='Choose any of these exchanges to buy cryptocurrencies:'
            title={
                activeAccount?.currency_config?.is_crypto
                    ? 'Buy cryptocurrencies'
                    : 'Buy cryptocurrencies via fiat onramp'
            }
        >
            <CashierOnboardingIconMarquee icons={onboardingOnrampIcons.light} />
        </CashierOnboardingCard>
    );
};

export default CashierOnboardingOnrampCard;
