import React from 'react';
import { useCurrentCurrencyConfig, useHasCryptoCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = ['IcCashierBanxa'];

const CashierOnboardingOnrampCard: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto, is_dark_mode_on } = ui;
    const { setDepositTarget } = general_store;
    const has_crypto_account = useHasCryptoCurrency();
    const currency_config = useCurrentCurrencyConfig();

    const onClick = () => {
        setDepositTarget('/cashier/on-ramp');
        if (currency_config.is_crypto || has_crypto_account) {
            openRealAccountSignup('choose');
            shouldNavigateAfterChooseCrypto('/cashier/on-ramp');
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    return (
        <CashierOnboardingCard
            title={
                currency_config.is_crypto
                    ? localize('Buy cryptocurrencies')
                    : localize('Buy cryptocurrencies via fiat onramp')
            }
            description={localize('Choose any of these exchanges to buy cryptocurrencies:')}
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons.map(icon => `${icon}${is_dark_mode_on ? 'Dark' : 'Light'}`)} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingOnrampCard;
