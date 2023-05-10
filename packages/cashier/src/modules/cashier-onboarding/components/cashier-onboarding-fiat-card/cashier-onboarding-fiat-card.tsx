import React, { useState } from 'react';
import { useHasFiatCurrency } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';
import { SwitchToFiatAccountDialog } from '../switch-to-fiat-account-dialog';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    { light: 'IcWalletCreditDebitLight', dark: 'IcWalletCreditDebitDark' },
    { light: 'IcCashierInstantBankTransferLight', dark: 'IcCashierInstantBankTransferDark' },
    { light: 'IcCashierEwalletLight', dark: 'IcCashierEwalletDark' },
    { light: 'IcCashierLocalPaymentMethodsLight', dark: 'IcCashierLocalPaymentMethodsDark' },
];

const CashierOnboardingFiatCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { is_crypto } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget, setIsDeposit } = general_store;
    const has_fiat_currency = useHasFiatCurrency();
    const can_switch_to_fiat_account = is_crypto() && has_fiat_currency;
    const [is_dialog_visible, setIsDialogVisible] = useState(false);

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);

        if (can_switch_to_fiat_account) {
            setIsDialogVisible(true);
        } else if (is_crypto()) {
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
        <CashierOnboardingCard
            title={localize('Deposit via bank wire, credit card, and e-wallet')}
            description={localize('Deposit via the following payment methods:')}
            onClick={is_dialog_visible ? undefined : onClick}
        >
            <CashierOnboardingIconMarquee icons={icons} />
            {can_switch_to_fiat_account && (
                <SwitchToFiatAccountDialog
                    is_visible={is_dialog_visible}
                    onCancel={() => setIsDialogVisible(false)}
                    onSwitchDone={onSwitchDone}
                />
            )}
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingFiatCard;
