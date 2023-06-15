import React from 'react';
import { useCurrencyConfig, useHasCryptoCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    { light: 'IcCashierBanxaLight', dark: 'IcCashierBanxaDark' },
];

const CashierOnboardingOnrampCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency } = client;
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto } = ui;
    const { setDepositTarget } = general_store;
    const has_crypto_account = useHasCryptoCurrency();
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

    const onClick = () => {
        setDepositTarget('/cashier/on-ramp');
        if (currency_config?.is_crypto || has_crypto_account) {
            openRealAccountSignup('choose');
            shouldNavigateAfterChooseCrypto('/cashier/on-ramp');
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    return (
        <CashierOnboardingCard
            title={
                currency_config?.is_crypto
                    ? localize('Buy cryptocurrencies')
                    : localize('Buy cryptocurrencies via fiat onramp')
            }
            description={localize('Choose any of these exchanges to buy cryptocurrencies:')}
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingOnrampCard;
