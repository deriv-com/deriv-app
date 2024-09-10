import React, { useEffect } from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Divider } from '../../components/divider';
import PageContainer from '../../components/page-container';
import { DepositSubPageAnalyticsEventTracker } from '../../components/deposit-sub-page-analytics-event-tracker';
import { useCashierStore } from '../../stores/useCashierStores';
import {
    DepositCryptoCurrencyDetails,
    DepositCryptoInfoNotice,
    DepositCryptoSideNotes,
    DepositCryptoWalletAddress,
} from './components';
import DepositCryptoSideNoteTryFiatOnRamp from './components/deposit-crypto-side-notes/deposit-crypto-side-note-try-fiat-onramp';

const DepositCrypto: React.FC = observer(() => {
    const { isDesktop } = useDevice();
    const { general_store } = useCashierStore();
    const currency_config = useCurrentCurrencyConfig();
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
            right={!isDesktop ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositSubPageAnalyticsEventTracker deposit_category='crypto' />
            {currency_config?.is_tUSDT && <DepositCryptoInfoNotice />}
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <Divider />
            {!isDesktop && <DepositCryptoSideNotes />}
            {!isDesktop && <Divider />}
            {/* This should be in the side notes, Need to talk to the design team to change it */}
            <div style={{ alignSelf: !isDesktop ? 'unset' : 'center' }}>
                <DepositCryptoSideNoteTryFiatOnRamp />
            </div>
        </PageContainer>
    );
});

export default DepositCrypto;
