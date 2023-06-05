import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { DepositCryptoRecentTransactionSideNote } from '../deposit-crypto-resent-transaction-side-note';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';
import DepositCryptoSideNoteeUSDT from './deposit-crypto-side-note-eusdt';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { data } = useCurrencyConfig(currency);

    return (
        <>
            <DepositCryptoRecentTransactionSideNote />
            <DepositCryptoSideNoteUSDT />
            {data?.is_usdt && <DepositCryptoSideNoteUSDT />}
            {data?.is_eusdt && <DepositCryptoSideNoteeUSDT />}
        </>
    );
});

export default DepositCryptoSideNotes;
