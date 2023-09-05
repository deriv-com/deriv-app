import React from 'react';
import { SideNote } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';

const CashierOnboardingSideNoteCrypto: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const currency_config = useCurrentCurrencyConfig();

    const onClick = () => {
        setDepositTarget('/cashier/deposit');
        openRealAccountSignup('add_crypto');
    };

    return (
        <SideNote
            description={localize(
                "Don't want to trade in {{currency_code}}? You can open another cryptocurrency account.",
                { currency_code: currency_config?.display_code }
            )}
            action={{ onClick, label: localize('Manage your accounts') }}
        />
    );
});

export default CashierOnboardingSideNoteCrypto;
