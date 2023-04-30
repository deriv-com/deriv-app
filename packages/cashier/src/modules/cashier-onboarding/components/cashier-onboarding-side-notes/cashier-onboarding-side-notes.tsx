import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import CashierOnboardingSideNoteCrypto from './cashier-onboarding-side-note-crypto';
import CashierOnboardingSideNoteFiat from './cashier-onboarding-side-note-fiat';
import './cashier-onboarding-side-notes.scss';

type TProps = {
    setSideNotes: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

const CashierOnboardingSideNotes: React.FC<TProps> = observer(({ setSideNotes }) => {
    const { client, ui } = useStore();
    const { is_crypto } = client;
    const { is_mobile } = ui;

    useEffect(() => {
        if (!is_mobile) {
            if (is_crypto()) {
                setSideNotes([<CashierOnboardingSideNoteCrypto key='crypto' />]);
            } else {
                setSideNotes([<CashierOnboardingSideNoteFiat key='fiat' />]);
            }
        }
    }, [setSideNotes, is_crypto, is_mobile]);

    if (!is_mobile) return null;

    if (is_crypto()) return <CashierOnboardingSideNoteCrypto />;

    return <CashierOnboardingSideNoteFiat />;
});

export default CashierOnboardingSideNotes;
