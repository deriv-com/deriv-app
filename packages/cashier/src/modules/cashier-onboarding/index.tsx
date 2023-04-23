import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { CashierOnboarding } from 'Components/cashier-onboarding';
import {
    CashierOnboardingTitle,
    CashierOnboardingP2PCard,
    CashierOnboardingCryptoCard,
    CashierOnboardingPaymentAgentCard,
    CashierOnboardingCashCard,
    CashierOnboardingOnrampCard,
} from './components';
import './onboarding.scss';

type TProps = {
    setSideNotes: (notes: object | null) => void;
};

const CashierOnboardingModule: React.FC<TProps> = ({ setSideNotes }) => (
    <ThemedScrollbars className='cashier-onboarding-page'>
        <CashierOnboardingTitle />
        <CashierOnboardingCashCard />
        <CashierOnboardingCryptoCard />
        <CashierOnboardingOnrampCard />
        <CashierOnboardingPaymentAgentCard />
        <CashierOnboardingP2PCard />
        <CashierOnboarding setSideNotes={setSideNotes} />
    </ThemedScrollbars>
);

export default CashierOnboardingModule;
