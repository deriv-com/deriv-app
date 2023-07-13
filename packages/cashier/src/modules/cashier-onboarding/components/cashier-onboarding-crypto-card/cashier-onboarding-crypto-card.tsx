import React from 'react';
import { useHasCryptoCurrency } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    { light: 'IcCashierBitcoinLight', dark: 'IcCashierBitcoinDark' },
    { light: 'IcCashierEthereumLight', dark: 'IcCashierEthereumDark' },
    { light: 'IcCashierLiteCoinLight', dark: 'IcCashierLiteCoinDark' },
    { light: 'IcCashierUsdCoinLight', dark: 'IcCashierUsdCoinDark' },
    { light: 'IcCashierTetherLight', dark: 'IcCashierTetherDark' },
];

const CashierOnboardingCryptoCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { is_crypto } = client;
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto } = ui;
    const { setDepositTarget } = general_store;
    const has_crypto_account = useHasCryptoCurrency();

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);
        if (is_crypto() || has_crypto_account) {
            openRealAccountSignup('choose');
            shouldNavigateAfterChooseCrypto(routes.cashier_deposit);
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    return (
        <CashierOnboardingCard
            title={localize('Deposit cryptocurrencies')}
            description={localize('We accept the following cryptocurrencies:')}
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingCryptoCard;
