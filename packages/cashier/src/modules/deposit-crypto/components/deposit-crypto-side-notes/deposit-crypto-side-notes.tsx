import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { SideNoteCryptoRecentTransaction } from '../../../../components/side-notes';
import DepositCryptoSideNoteeUSDT from './deposit-crypto-side-note-eusdt';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { data } = useCurrencyConfig(currency);

    return (
        <>
            <SideNoteCryptoRecentTransaction />
            <DepositCryptoSideNoteUSDT />
            {data?.is_usdt && <DepositCryptoSideNoteUSDT />}
            {data?.is_eusdt && <DepositCryptoSideNoteeUSDT />}
        </>
    );
});

export default DepositCryptoSideNotes;
