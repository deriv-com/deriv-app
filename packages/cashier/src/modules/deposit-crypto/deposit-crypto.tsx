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
    const { isDesktop: is_desktop } = useDevice();
    const { general_store } = useCashierStore();
    const currency_config = useCurrentCurrencyConfig();
    const { setIsDeposit } = general_store;
    const is_onramp_available = currency_config.platform.ramp.length > 0;

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
            right={!is_desktop ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositSubPageAnalyticsEventTracker deposit_category='crypto' />
            {currency_config?.is_tUSDT && <DepositCryptoInfoNotice />}
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            {(!is_desktop || is_onramp_available) && <Divider />}
            {/* This should be in the side notes, Need to talk to the design team to change it */}
            {is_onramp_available && (
                <div style={{ alignSelf: !is_desktop ? 'unset' : 'center' }}>
                    <DepositCryptoSideNoteTryFiatOnRamp />
                </div>
            )}
            {!is_desktop && <DepositCryptoSideNotes />}
        </PageContainer>
    );
});

export default DepositCrypto;
