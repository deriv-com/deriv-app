import React from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { TransactionsCryptoTransactionStatusSideNote } from '../../../transactions-crypto/components';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';
import './deposit-crypto-side-notes.scss';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const currency_config = useCurrentCurrencyConfig();

    return (
        <>
            <TransactionsCryptoTransactionStatusSideNote />
            {currency_config?.is_USDT && <DepositCryptoSideNoteUSDT currency='USDT' />}
            {currency_config?.is_eUSDT && <DepositCryptoSideNoteUSDT currency='eUSDT' />}
        </>
    );
});

export default DepositCryptoSideNotes;
