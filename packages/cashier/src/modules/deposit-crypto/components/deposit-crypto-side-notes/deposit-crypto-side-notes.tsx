import React from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { SideNoteCryptoRecentTransaction } from '../../../../components/side-notes';
import DepositCryptoSideNoteeUSDT from './deposit-crypto-side-note-eusdt';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const currency_config = useCurrentCurrencyConfig();

    return (
        <>
            <SideNoteCryptoRecentTransaction />
            {currency_config.is_USDT && <DepositCryptoSideNoteUSDT />}
            {currency_config.is_eUSDT && <DepositCryptoSideNoteeUSDT />}
        </>
    );
});

export default DepositCryptoSideNotes;
