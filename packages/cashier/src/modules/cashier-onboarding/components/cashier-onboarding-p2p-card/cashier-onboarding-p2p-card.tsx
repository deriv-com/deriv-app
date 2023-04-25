import React from 'react';
import { useHistory } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { useHasFiatCurrency, useHasUSDCurrency, useIsP2PEnabled } from '@deriv/hooks';
import { CashierOnboardingCard } from '../cashier-onboarding-card';
import { useCashierStore } from '../../../../stores/useCashierStores';

const CashierOnboardingP2PCard: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store, account_prompt_dialog } = useCashierStore();
    const { is_crypto } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const { shouldNavigateAfterPrompt } = account_prompt_dialog;
    const history = useHistory();
    const { data: is_p2p_enabled } = useIsP2PEnabled();
    const has_usd_currency = useHasUSDCurrency();
    const has_fiat_currency = useHasFiatCurrency();
    const should_show_p2p_card = is_p2p_enabled && has_usd_currency;

    const onClick = () => {
        setDepositTarget(routes.cashier_p2p);

        if (is_crypto()) {
            if (has_fiat_currency) {
                shouldNavigateAfterPrompt(routes.cashier_p2p, 'DP2P');
            } else {
                openRealAccountSignup('add_fiat');
            }
        } else {
            history.push(routes.cashier_p2p);
        }
    };

    if (!should_show_p2p_card) return null;

    return (
        <CashierOnboardingCard
            title={localize('Deposit with Deriv P2P')}
            description={localize(
                'Deposit with your local currency via peer-to-peer exchange with fellow traders in your country.'
            )}
            onClick={onClick}
        />
    );
});

export default CashierOnboardingP2PCard;
