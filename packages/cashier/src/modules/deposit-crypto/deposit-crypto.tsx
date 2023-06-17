import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import { Divider } from '../../components/divider';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import {
    DepositCryptoCurrencyDetails,
    DepositCryptoSideNotes,
    DepositCryptoTryFiatOnRamp,
    DepositCryptoWalletAddress,
} from './components';

const DepositCrypto: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { general_store } = useCashierStore();
    const { setIsDeposit } = general_store;

    useEffect(() => {
        setIsDeposit(true);

        return () => {
            setIsDeposit(false);
        };
    }, [setIsDeposit]);

    return (
        <PageContainer
            // Hide the side note and render it in the page content on mobile to match the design
            right={is_mobile ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <Divider />
            {is_mobile && <DepositCryptoSideNotes />}
            {is_mobile && <Divider />}
            <DepositCryptoTryFiatOnRamp />
        </PageContainer>
    );
});

export default DepositCrypto;
