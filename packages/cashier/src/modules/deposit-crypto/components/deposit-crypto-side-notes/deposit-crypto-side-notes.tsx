import React from 'react';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { SideNoteCryptoRecentTransaction } from '../../../../components/side-notes';
import DepositCryptoSideNoteeUSDT from './deposit-crypto-side-note-eusdt';
import DepositCryptoSideNoteUSDT from './deposit-crypto-side-note-usdt';

const DepositCryptoSideNotes: React.FC = observer(() => {
    const { client } = useStore();
    const { currency } = client;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

    return (
        <>
            <SideNoteCryptoRecentTransaction />
            <DepositCryptoSideNoteUSDT />
            {currency_config?.is_USDT && <DepositCryptoSideNoteUSDT />}
            {currency_config?.is_eUSDT && <DepositCryptoSideNoteeUSDT />}
        </>
    );
});

export default DepositCryptoSideNotes;
