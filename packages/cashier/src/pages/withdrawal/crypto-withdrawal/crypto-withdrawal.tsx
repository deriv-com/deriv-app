import React from 'react';
import { useCashierStore } from '../../../stores/useCashierStores';
import CryptoWithdrawForm from '../crypto-withdraw-form';
import ErrorDialog from '../../../components/error-dialog';

const CryptoWithdrawal = ({ is_wallet }: { is_wallet?: boolean }) => {
    const cashier = useCashierStore();
    const { is_withdraw_confirmed, error } = cashier.withdraw;
    const { is_crypto_transactions_visible } = cashier.transaction_history;

    if (!is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return (
            <React.Fragment>
                <ErrorDialog error={error} />
                <CryptoWithdrawForm is_wallet={is_wallet} />
            </React.Fragment>
        );
    }

    return null;
};

export default CryptoWithdrawal;
