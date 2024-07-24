import React, { useState } from 'react';
import { useCurrentCurrencyConfig, useHasFiatCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { SwitchToFiatAccountDialog } from '../../../../components/switch-to-fiat-account-dialog';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    'IcCashierCreditDebit',
    'IcCashierInstantBankTransfer',
    'IcCashierEwallet',
    'IcCashierLocalPaymentMethods',
];

const CashierOnboardingFiatCard: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, is_dark_mode_on } = ui;
    const { setDepositTarget, setIsDeposit } = general_store;
    const currency_config = useCurrentCurrencyConfig();
    const has_fiat_currency = useHasFiatCurrency();
    const can_switch_to_fiat_account = currency_config?.is_crypto && has_fiat_currency;
    const [is_dialog_visible, setIsDialogVisible] = useState(false);

    const onClick = () => {
        setDepositTarget('/cashier/deposit');

        if (can_switch_to_fiat_account) {
            setIsDialogVisible(true);
        } else if (currency_config?.is_crypto) {
            openRealAccountSignup('add_fiat');
        } else {
            setIsDeposit(true);
        }
    };

    const onSwitchDone = () => {
        setIsDialogVisible(false);
        setIsDeposit(true);
    };

    return (
        <React.Fragment>
            <CashierOnboardingCard
                title={localize('Deposit via bank wire, credit card, and e-wallet')}
                description={localize('Deposit via the following payment methods:')}
                depositCategory='fiat'
                onClick={is_dialog_visible ? undefined : onClick}
            >
                <CashierOnboardingIconMarquee
                    icons={icons.map(icon => `${icon}${is_dark_mode_on ? 'Dark' : 'Light'}`)}
                />
            </CashierOnboardingCard>
            {can_switch_to_fiat_account && (
                <SwitchToFiatAccountDialog
                    is_visible={is_dialog_visible}
                    onCancel={() => setIsDialogVisible(false)}
                    onSwitchDone={onSwitchDone}
                />
            )}
        </React.Fragment>
    );
});

export default CashierOnboardingFiatCard;
