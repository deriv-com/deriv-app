import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useCashierLocked, useCurrencyConfig, useDepositLocked, useIsSystemMaintenance } from '@deriv/hooks';
import { Virtual } from 'Components/cashier-container';
import CashierLocked from 'Components/cashier-locked';

const CashierLockedChecker: React.FC<React.PropsWithChildren<unknown>> = observer(({ children }) => {
    const { client } = useStore();
    const { currency, is_virtual } = client;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);
    const is_cashier_locked = useCashierLocked();
    const is_system_maintenance = useIsSystemMaintenance();
    const is_deposit_locked = useDepositLocked();

    if (is_virtual) return <Virtual />;

    if (is_system_maintenance) {
        if (is_cashier_locked || (is_deposit_locked && currency_config?.is_crypto)) {
            return <CashierLocked />;
        }
    }

    if (is_cashier_locked) return <CashierLocked />;

    return <>{children}</>;
});

export default CashierLockedChecker;
