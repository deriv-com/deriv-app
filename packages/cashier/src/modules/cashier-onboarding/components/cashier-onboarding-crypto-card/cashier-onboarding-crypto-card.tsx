import React from 'react';
import { useCurrentCurrencyConfig, useHasCryptoCurrency } from '@deriv/hooks';
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
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto } = ui;
    const { setDepositTarget } = general_store;
    const has_crypto_account = useHasCryptoCurrency();
    const currency_config = useCurrentCurrencyConfig();

    const onClick = () => {
        setDepositTarget('/cashier/deposit');
        if (currency_config.is_crypto || has_crypto_account) {
            openRealAccountSignup('choose');
            shouldNavigateAfterChooseCrypto('/cashier/deposit');
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
