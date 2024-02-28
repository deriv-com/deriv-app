import React from 'react';
import {
    CashierOnboardingAccountIdentifierMessage,
    CashierOnboardingCryptoCard,
    CashierOnboardingFiatCard,
    CashierOnboardingOnrampCard,
    CashierOnboardingP2PCard,
    CashierOnboardingPaymentAgentCard,
} from './components';
import styles from './CashierOnboarding.module.scss';

type TProps = {
    setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>;
};

const CashierOnboarding: React.FC<TProps> = ({ setIsDeposit }) => {
    return (
        <div className={styles.container}>
            <CashierOnboardingAccountIdentifierMessage />
            <CashierOnboardingFiatCard setIsDeposit={setIsDeposit} />
            <CashierOnboardingCryptoCard setIsDeposit={setIsDeposit} />
            <CashierOnboardingOnrampCard />
            <CashierOnboardingPaymentAgentCard />
            <CashierOnboardingP2PCard />
        </div>
    );
};

export default CashierOnboarding;
