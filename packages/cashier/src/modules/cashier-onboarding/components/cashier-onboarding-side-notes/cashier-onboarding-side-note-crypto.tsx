import React from 'react';
import { SideNote } from '@deriv/components';
import { getCurrencyDisplayCode, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';

const CashierOnboardingSideNoteCrypto: React.FC = observer(() => {
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { currency } = client;
    const { openRealAccountSignup } = ui;
    const { setDepositTarget } = general_store;
    const currency_code = getCurrencyDisplayCode(currency);

    const onClick = () => {
        setDepositTarget(routes.cashier_deposit);
        openRealAccountSignup('add_crypto');
    };

    return (
        <SideNote
            description={localize(
                "Don't want to trade in {{currency_code}}? You can open another cryptocurrency account.",
                { currency_code }
            )}
            action={{ onClick, label: localize('Manage your accounts') }}
        />
    );
});

export default CashierOnboardingSideNoteCrypto;
