import React, { useState } from 'react';
import {
    useCurrentCurrencyConfig,
    useHasFiatCurrency,
    useHasP2PSupportedCurrencies,
    useIsP2PEnabled,
} from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { SwitchToFiatAccountDialog } from '../../../../components/switch-to-fiat-account-dialog';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';

const CashierOnboardingP2PCard: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const history = useHistory();
    const { data: has_p2p_supported_currencies } = useHasP2PSupportedCurrencies();
    const { is_p2p_enabled } = useIsP2PEnabled();
    const has_fiat_currency = useHasFiatCurrency();
    const currency_config = useCurrentCurrencyConfig();
    const can_switch_to_fiat_account = currency_config?.is_crypto && has_fiat_currency;
    const [is_dialog_visible, setIsDialogVisible] = useState(false);
    const should_show_p2p_card = is_p2p_enabled || has_p2p_supported_currencies;

    const onClick = () => {
        setDepositTarget('/cashier/p2p');

        if (can_switch_to_fiat_account) {
            setIsDialogVisible(true);
        } else if (currency_config?.is_crypto) {
            openRealAccountSignup('add_fiat');
        } else {
            history.push('/cashier/p2p');
        }
    };

    const onSwitchDone = () => {
        setIsDialogVisible(false);
        history.push('/cashier/p2p');
    };

    if (!should_show_p2p_card) return null;

    return (
        <React.Fragment>
            <CashierOnboardingCard
                title={localize('Deposit with Deriv P2P')}
                description={localize(
                    'Deposit with your local currency via peer-to-peer exchange with fellow traders in your country.'
                )}
                depositCategory='p2p'
                onClick={is_dialog_visible ? undefined : onClick}
            />
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

export default CashierOnboardingP2PCard;
