import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { WalletDeposit } from '../WalletDeposit';
import { WalletTransactions } from '../WalletTransactions';
import { WalletTransfer } from '../WalletTransfer';

const WalletCashierContent = () => {
    const history = useHistory();
    const isTransfer = useRouteMatch('/wallets/cashier/transfer');
    const isDeposit = useRouteMatch('/wallets/cashier/deposit');
    const isTransactions = useRouteMatch('/wallets/cashier/transactions');
    const isWithdraw = useRouteMatch('/wallets/cashier/withdraw');

    useEffect(() => {
        // redirect to deposit page if no other page is matched
        if (!isTransfer && !isDeposit && !isTransactions && !isWithdraw) {
            history.push('/wallets/cashier/deposit');
        }
    }, [isTransfer, isDeposit, isTransactions, isWithdraw, history]);

    if (isDeposit) return <WalletDeposit />;

    if (isTransfer) return <WalletTransfer />;

    if (isTransactions) return <WalletTransactions />;

    return <></>;
};

export default WalletCashierContent;
