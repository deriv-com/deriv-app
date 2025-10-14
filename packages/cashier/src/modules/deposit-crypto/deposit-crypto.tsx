import React, { useEffect } from 'react';

import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

import { DepositSubPageAnalyticsEventTracker } from '../../components/deposit-sub-page-analytics-event-tracker';
import { Divider } from '../../components/divider';
import PageContainer from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';

import {
    DepositCryptoCurrencyDetails,
    DepositCryptoInfoNotice,
    DepositCryptoSideNotes,
    DepositCryptoWalletAddress,
} from './components';

const DepositCrypto: React.FC = observer(() => {
    const { isDesktop: is_desktop } = useDevice();
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
            // side notes for consistency and then we can remove unnecessary components from the children.
            right={!is_desktop ? undefined : <DepositCryptoSideNotes />}
        >
            <DepositSubPageAnalyticsEventTracker deposit_category='crypto' />
            {currency_config?.is_tUSDT && <DepositCryptoInfoNotice />}
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            {!is_desktop && <Divider />}
            {!is_desktop && <DepositCryptoSideNotes />}
        </PageContainer>
    );
});

export default DepositCrypto;
