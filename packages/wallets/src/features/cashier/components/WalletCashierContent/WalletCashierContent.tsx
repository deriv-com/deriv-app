import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { WalletDeposit } from '../../flows/WalletDeposit';
import { WalletResetBalance } from '../../flows/WalletResetBalance';
import { WalletTransactions } from '../../flows/WalletTransactions';
import { WalletTransfer } from '../../flows/WalletTransfer';
import { WalletWithdrawal } from '../../flows/WalletWithdrawal';

const WalletCashierContent = () => {
    const history = useHistory();

    const isDeposit = useRouteMatch('/wallets/cashier/deposit');
    const isResetBalance = useRouteMatch('/wallets/cashier/reset-balance');
    const isTransfer = useRouteMatch('/wallets/cashier/transfer');
    const isTransactions = useRouteMatch('/wallets/cashier/transactions');
    const isWithdraw = useRouteMatch('/wallets/cashier/withdraw');

    useEffect(() => {
        // redirect to deposit page if no other page is matched
        if (!isTransfer && !isDeposit && !isTransactions && !isWithdraw && !isResetBalance) {
            history.push('/wallets/cashier/deposit');
        }
    }, [isTransfer, isDeposit, isTransactions, isWithdraw, isResetBalance, history]);

    if (isDeposit) return <WalletDeposit />;

    if (isResetBalance) return <WalletResetBalance />;

    if (isTransfer) return <WalletTransfer />;

    if (isTransactions) return <WalletTransactions />;

    if (isWithdraw) {
        return <WalletWithdrawal />;
    }

    return <></>;
};

export default WalletCashierContent;
