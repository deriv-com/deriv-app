import React from 'react';
import { Authorize, GetAccountStatus } from '@deriv/api-types';
import { connect } from 'Stores/connect';
import EmptyState from 'Components/empty-state';
import getMessage from './cashier-locked-provider';
import { TRootStore } from 'Types';

type TAccount = NonNullable<Authorize['account_list']>[0];

type TProps = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    current_currency_type: string;
    is_cashier_locked: boolean;
    is_deposit_locked: boolean;
    is_identity_verification_needed: boolean;
    is_system_maintenance: boolean;
    is_withdrawal_locked: boolean;
    loginid: string;
};

const CashierLocked = ({
    account_status,
    accounts,
    current_currency_type,
    is_cashier_locked,
    is_deposit_locked,
    is_system_maintenance,
    is_withdrawal_locked,
    loginid,
    is_identity_verification_needed,
}: TProps) => {
    const state = getMessage({
        cashier_validation: account_status.cashier_validation,
        is_crypto: current_currency_type === 'crypto',
        is_system_maintenance,
        is_cashier_locked,
        is_deposit_locked,
        is_withdrawal_locked,
        is_identity_verification_needed,
        excluded_until: accounts ? accounts[loginid]?.excluded_until : undefined,
    });

    return <EmptyState icon={state.icon} title={state.title} description={state.description} />;
};

export default connect(({ client, modules }: TRootStore) => ({
    account_status: client.account_status,
    accounts: client.accounts,
    current_currency_type: client.current_currency_type,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_deposit_locked: client.is_deposit_lock,
    is_system_maintenance: modules.cashier.general_store.is_system_maintenance,
    is_withdrawal_locked: client.is_withdrawal_lock,
    loginid: client.loginid,
    is_identity_verification_needed: client.is_identity_verification_needed,
}))(CashierLocked);
