import React from 'react';
import { useHistory } from 'react-router';
import { useStore, observer } from '@deriv/stores';
import { EmptyState } from '@deriv/components';
import { useCashierLocked, useDepositLocked, useIsSystemMaintenance, useMFAccountStatus } from '@deriv/hooks';
import getMessage from './cashier-locked-provider';
import './cashier-locked.scss';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';

const CashierLocked = observer(() => {
    const {
        client,
        traders_hub: { closeAccountTransferModal },
    } = useStore();
    const {
        account_status,
        accounts,
        current_currency_type,
        is_eu,
        is_withdrawal_lock: is_withdrawal_locked,
        loginid,
        is_identity_verification_needed,
    } = client;
    const mf_account_status = useMFAccountStatus();
    const is_cashier_locked = useCashierLocked();
    const is_system_maintenance = useIsSystemMaintenance();
    const is_deposit_locked = useDepositLocked();
    const history = useHistory();

    const state = getMessage({
        cashier_validation: account_status?.cashier_validation,
        closeAccountTransferModal,
        excluded_until: loginid ? accounts[loginid]?.excluded_until : undefined,
        history,
        is_crypto: current_currency_type === 'crypto',
        is_eu,
        is_system_maintenance,
        is_cashier_locked,
        is_deposit_locked,
        is_withdrawal_locked,
        is_identity_verification_needed,
        is_pending_verification: mf_account_status === MT5_ACCOUNT_STATUS.PENDING,
    });

    return (
        <div className='cashier-locked'>
            <EmptyState icon={state.icon} title={state.title} description={state.description} action={state.action} />
        </div>
    );
});

export default CashierLocked;
