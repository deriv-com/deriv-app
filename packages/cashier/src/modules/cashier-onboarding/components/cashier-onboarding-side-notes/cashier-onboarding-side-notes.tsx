import React from 'react';
import { observer, useStore } from '@deriv/stores';
import CashierOnboardingSideNoteCrypto from './cashier-onboarding-side-note-crypto';
import CashierOnboardingSideNoteFiat from './cashier-onboarding-side-note-fiat';
import CashierOnboardingSideNotePaymentMethods from './cashier-onboarding-side-note-payment-methods';

const CashierOnboardingSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { is_crypto } = client;

    return (
        <>
            {is_crypto() && <CashierOnboardingSideNoteCrypto />}
            {!is_crypto() && <CashierOnboardingSideNoteFiat />}
            <CashierOnboardingSideNotePaymentMethods />
        </>
    );
});

export default CashierOnboardingSideNotes;
