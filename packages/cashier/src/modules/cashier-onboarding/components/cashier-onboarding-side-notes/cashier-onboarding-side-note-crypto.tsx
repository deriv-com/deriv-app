import React from 'react';
import { SideNote } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { useCurrencyConfig } from '@deriv/hooks';

const CashierOnboardingSideNoteCrypto: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);

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
