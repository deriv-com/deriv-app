import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { SideNotePaymentMethodsLearnMore } from '../../../../components/side-notes';
import CashierOnboardingSideNoteCrypto from './cashier-onboarding-side-note-crypto';
import CashierOnboardingSideNoteFiat from './cashier-onboarding-side-note-fiat';

const CashierOnboardingSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { data } = useCurrencyConfig(currency);

    return (
        <>
            {data?.is_crypto && <CashierOnboardingSideNoteCrypto />}
            {data?.is_fiat && <CashierOnboardingSideNoteFiat />}
            <SideNotePaymentMethodsLearnMore />
        </>
    );
});

export default CashierOnboardingSideNotes;
