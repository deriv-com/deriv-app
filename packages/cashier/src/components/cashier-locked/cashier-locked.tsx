import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { useAccountStatus, useDepositLocked, useWithdrawalLocked } from '@deriv/hooks';
import EmptyState from 'Components/empty-state';
import getMessage from './cashier-locked-provider';

const CashierLocked = observer(() => {
    const { client } = useStore();
    const { accounts, current_currency_type, loginid, is_identity_verification_needed } = client;

    const { data: get_account_status, statuses } = useAccountStatus();
    const { is_cashier_locked } = statuses?.status || false;

    const is_deposit_locked = useDepositLocked();
    const { is_withdrawal_locked } = useWithdrawalLocked();

    const state = getMessage({
        cashier_validation: get_account_status?.cashier_validation,
        is_crypto: current_currency_type === 'crypto',
        is_cashier_locked,
        is_deposit_locked,
        is_withdrawal_locked,
        is_identity_verification_needed,
        excluded_until: loginid ? accounts[loginid]?.excluded_until : undefined,
    });

    return <EmptyState icon={state.icon} title={state.title} description={state.description} />;
});

export default CashierLocked;
