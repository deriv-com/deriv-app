import React from 'react';
import { useCashierStore } from '../../../stores/useCashierStores';
import CryptoWithdrawForm from '../crypto-withdraw-form';
import CryptoWithdrawReceipt from '../crypto-withdraw-receipt';
import CryptoWithdrawReceiptWallet from '../crypto-withdraw-receipt-wallet';
import CryptoTransactionsHistory from '../../../components/crypto-transactions-history';
import ErrorDialog from '../../../components/error-dialog';
import './crypto-withdrawal.scss';

const CryptoWithdrawal = ({ is_wallet }: { is_wallet?: boolean }) => {
    const cashier = useCashierStore();
    const { is_withdraw_confirmed, error } = cashier.withdraw;
    const { is_crypto_transactions_visible } = cashier.transaction_history;

    if (!is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return (
            <div className='crypto-withdrawal'>
                <div className='crypto-withdrawal__sidebar' />
                <div className='crypto-withdrawal__content'>
                    <ErrorDialog error={error} />
                    <CryptoWithdrawForm is_wallet={is_wallet} />
                </div>
            </div>
        );
    }

    if (is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return is_wallet ? <CryptoWithdrawReceiptWallet /> : <CryptoWithdrawReceipt />;
    }

    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }

    return null;
};

export default CryptoWithdrawal;
