import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useGetAccountStatus } from '@deriv/api';
import { Loader } from '../../../../components';
import { WalletDeposit } from '../../flows/WalletDeposit';
import { WalletFiatOnRamp } from '../../flows/WalletFiatOnRamp';
import { WalletResetBalance } from '../../flows/WalletResetBalance';
import { WalletTransactions } from '../../flows/WalletTransactions';
import { WalletTransfer } from '../../flows/WalletTransfer';
import { WalletWithdrawal } from '../../flows/WalletWithdrawal';
import { DepositLocked, WithdrawalLocked } from '../../screens';

const WalletCashierContent = () => {
    const history = useHistory();
    const { data: accountStatus, isLoading } = useGetAccountStatus();

    const isDeposit = useRouteMatch('/wallets/cashier/deposit');
    const isFiatOnRamp = useRouteMatch('/wallets/cashier/on-ramp');
    const isResetBalance = useRouteMatch('/wallets/cashier/reset-balance');
    const isTransfer = useRouteMatch('/wallets/cashier/transfer');
    const isTransactions = useRouteMatch('/wallets/cashier/transactions');
    const isWithdraw = useRouteMatch('/wallets/cashier/withdraw');

    useEffect(() => {
        // redirect to deposit page if no other page is matched
        if (!isTransfer && !isDeposit && !isTransactions && !isWithdraw && !isResetBalance && !isFiatOnRamp) {
            history.push('/wallets/cashier/deposit');
        }
    }, [isTransfer, isDeposit, isTransactions, isWithdraw, isResetBalance, isFiatOnRamp, history]);

    if (isLoading) return <Loader />;

    if (isDeposit && accountStatus)
        return (
            <DepositLocked accountStatus={accountStatus}>
                <WalletDeposit />
            </DepositLocked>
        );

    if (isFiatOnRamp) return <WalletFiatOnRamp />;

    if (isResetBalance) return <WalletResetBalance />;

    if (isTransfer) return <WalletTransfer />;

    if (isTransactions) return <WalletTransactions />;

    if (isWithdraw && accountStatus) {
        return (
            <WithdrawalLocked accountStatus={accountStatus}>
                <WalletWithdrawal />
            </WithdrawalLocked>
        );
    }

    return <></>;
};

export default WalletCashierContent;
