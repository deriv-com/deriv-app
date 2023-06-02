import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CashierOnboardingSideNoteCrypto from './cashier-onboarding-side-note-crypto';
import CashierOnboardingSideNoteFiat from './cashier-onboarding-side-note-fiat';
import CashierOnboardingSideNotePaymentMethods from './cashier-onboarding-side-note-payment-methods';

const CashierOnboardingSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { data } = useCurrencyConfig(currency);
    const is_crypto = data?.is_crypto || false;

    return (
        <>
            {is_crypto && <CashierOnboardingSideNoteCrypto />}
            {!is_crypto && <CashierOnboardingSideNoteFiat />}
            <CashierOnboardingSideNotePaymentMethods />
        </>
    );
});

export default CashierOnboardingSideNotes;
