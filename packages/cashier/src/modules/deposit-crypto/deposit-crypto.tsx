import React, { useEffect } from 'react';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Divider } from '../../components/divider';
import PageContainer from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { DepositCryptoCurrencyDetails, DepositCryptoSideNotes, DepositCryptoWalletAddress } from './components';
import DepositCryptoSideNoteTryFiatOnRamp from './components/deposit-crypto-side-notes/deposit-crypto-side-note-try-fiat-onramp';

const DepositCrypto: React.FC = observer(() => {
    const { isMobile } = useDevice();
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
            // Hide the side note and render it in the page content on mobile to match the design,
            // Need to talk with the design team to put `DepositCryptoSideNoteTryFiatOnRamp` in the
            // side notes for consistency and then we can remove unnecessary components from the children.
            right={isMobile ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <Divider />
            {isMobile && <DepositCryptoSideNotes />}
            {isMobile && <Divider />}
            {/* This should be in the side notes, Need to talk to the design team to change it */}
            <div style={{ alignSelf: isMobile ? 'unset' : 'center' }}>
                <DepositCryptoSideNoteTryFiatOnRamp />
            </div>
        </PageContainer>
    );
});

export default DepositCrypto;
