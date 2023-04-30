import React from 'react';
import { localize } from '@deriv/translations';

export const getCashierOptions = (is_demo: boolean) => {
    return [
        { is_visible: !is_demo, icon: 'IcAdd', label: localize('Deposit'), content: <p>Deposit</p> },
        { is_visible: !is_demo, icon: 'IcMinus', label: localize('Withdraw'), content: <p>Withdraw</p> },
        { is_visible: true, icon: 'IcAccountTransfer', label: localize('Transfer'), content: <p>Transfer</p> },
        { is_visible: true, icon: 'IcStatement', label: localize('Transactions'), content: <p>Transactions</p> },
        { is_visible: is_demo, icon: 'IcAdd', label: localize('Reset balanace'), content: <p>Reset balanace</p> },
    ];
};
