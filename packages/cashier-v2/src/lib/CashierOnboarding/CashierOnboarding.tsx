import React from 'react';
import { CashierOnboardingAccountIdentifierMessage } from './components/CashierOnboardingAccountIdentifierMessage';
import { CashierOnboardingCryptoCard } from './components/CashierOnboardingCryptoCard';
import { CashierOnboardingFiatCard } from './components/CashierOnboardingFiatCard';
import { CashierOnboardingOnrampCard } from './components/CashierOnboardingOnrampCard';
import { CashierOnboardingP2PCard } from './components/CashierOnboardingP2pCard';
import { CashierOnboardingPaymentAgentCard } from './components/CashierOnboardingPaymentAgentCard';
import styles from './CashierOnboarding.module.scss';

const CashierOnboarding: React.FC = () => {
    return (
        <div className={styles.container}>
            <CashierOnboardingAccountIdentifierMessage />
            <CashierOnboardingFiatCard />
            <CashierOnboardingCryptoCard />
            <CashierOnboardingOnrampCard />
            <CashierOnboardingPaymentAgentCard />
            <CashierOnboardingP2PCard />
        </div>
    );
};

export default CashierOnboarding;
