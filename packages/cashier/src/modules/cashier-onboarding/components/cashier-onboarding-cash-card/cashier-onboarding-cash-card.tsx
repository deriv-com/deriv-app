import React from 'react';
import { useHasFiatCurrency } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { CashierOnboardingIconMarquee } from '../cashier-onboarding-icon-marquee';

const icons: React.ComponentProps<typeof CashierOnboardingIconMarquee>['icons'] = [
    { light: 'IcWalletCreditDebitLight', dark: 'IcWalletCreditDebitDark' },
    { light: 'IcCashierInstantBankTransferLight', dark: 'IcCashierInstantBankTransferDark' },
    { light: 'IcCashierEwalletLight', dark: 'IcCashierEwalletDark' },
    { light: 'IcCashierLocalPaymentMethodsLight', dark: 'IcCashierLocalPaymentMethodsDark' },
];

const CashierOnboardingCashCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store, account_prompt_dialog } = useCashierStore();
    const { is_crypto } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget, setIsDeposit } = general_store;
    const { shouldNavigateAfterPrompt } = account_prompt_dialog;
    const has_fiat_currency = useHasFiatCurrency();

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);

        if (is_crypto()) {
            if (has_fiat_currency) {
                shouldNavigateAfterPrompt(routes.cashier_deposit, 'deposit');
            } else {
                openRealAccountSignup('add_fiat');
            }
        } else {
            setIsDeposit(true);
        }
    };

    return (
        <CashierOnboardingCard
            title={localize('Deposit via bank wire, credit card, and e-wallet')}
            description={localize('Deposit via the following payment methods:')}
            onClick={onClick}
        >
            <CashierOnboardingIconMarquee icons={icons} />
        </CashierOnboardingCard>
    );
});

export default CashierOnboardingCashCard;
