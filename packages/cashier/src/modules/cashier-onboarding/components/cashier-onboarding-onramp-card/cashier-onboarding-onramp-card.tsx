import React from 'react';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = ['IcCashierBanxa'];

const CashierOnboardingOnrampCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { available_onramp_currencies, account_list } = client;
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto, is_dark_mode_on } = ui;
    const { setDepositTarget } = general_store;
    const currency_config = useCurrentCurrencyConfig();
    const has_onramp_accounts = account_list.some(
        account => account.title && available_onramp_currencies.includes(account.title)
    );

    const onClick = () => {
        setDepositTarget('/cashier/on-ramp');
        if (has_onramp_accounts) {
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
            depositCategory='fiat_onramp'
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons.map(icon => `${icon}${is_dark_mode_on ? 'Dark' : 'Light'}`)} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingOnrampCard;
