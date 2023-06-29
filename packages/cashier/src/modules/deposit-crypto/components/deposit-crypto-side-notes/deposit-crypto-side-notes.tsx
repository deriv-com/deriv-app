import React from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { CryptoTransactionsSideNoteResentTransaction } from '../../../crypto-transactions/components';
import DepositCryptoSideNoteeUSDT from './deposit-crypto-side-note-eusdt';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const currency_config = useCurrentCurrencyConfig();

    return (
        <>
            <CryptoTransactionsSideNoteResentTransaction />
            {currency_config.is_USDT && <DepositCryptoSideNoteUSDT />}
            {currency_config.is_eUSDT && <DepositCryptoSideNoteeUSDT />}
        </>
    );
});

export default DepositCryptoSideNotes;
