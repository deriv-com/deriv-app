import React from 'react';
import { useCurrentCurrencyConfig, useHasCryptoCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    'IcCashierBitcoin',
    'IcCashierEthereum',
    'IcCashierLiteCoin',
    'IcCashierUsdCoin',
    'IcCashierTether',
];

const CashierOnboardingCryptoCard: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto, is_dark_mode_on } = ui;
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
            depositCategory='crypto'
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons.map(icon => `${icon}${is_dark_mode_on ? 'Dark' : 'Light'}`)} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingCryptoCard;
