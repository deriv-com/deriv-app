import React from 'react';
import { useCashierLocked, useCurrentCurrencyConfig, useDepositLocked, useIsSystemMaintenance } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { PageContainer } from 'Components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { Virtual } from '../cashier-container';
import CashierLocked from '../cashier-locked';

const CashierLockedChecker: React.FC<React.PropsWithChildren<unknown>> = observer(({ children }) => {
    const { client } = useStore();
    const { is_virtual } = client;
    const currency_config = useCurrentCurrencyConfig();
    const is_cashier_locked = useCashierLocked();
    const is_system_maintenance = useIsSystemMaintenance();
    const is_deposit_locked = useDepositLocked();
    const { withdraw } = useCashierStore();
    const { is_withdrawal_locked } = withdraw;

    if (is_virtual)
        return (
            <PageContainer hide_breadcrumb>
                <Virtual />
            </PageContainer>
        );

    if (is_system_maintenance) {
        if (is_cashier_locked || ((is_deposit_locked || is_withdrawal_locked) && currency_config.is_crypto)) {
            return (
                <PageContainer hide_breadcrumb>
                    <CashierLocked />
                </PageContainer>
            );
        }
    }

    if (is_cashier_locked)
        return (
            <PageContainer hide_breadcrumb>
                <CashierLocked />
            </PageContainer>
        );

    return <>{children}</>;
});

export default CashierLockedChecker;
