import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { WalletDeposit } from '../../flows/WalletDeposit';
import { WalletFiatOnRamp } from '../../flows/WalletFiatOnRamp';
import { WalletResetBalance } from '../../flows/WalletResetBalance';
import { WalletTransactions } from '../../flows/WalletTransactions';
import { WalletTransfer } from '../../flows/WalletTransfer';
import { WalletWithdrawal } from '../../flows/WalletWithdrawal';
import { CashierLocked, DepositLocked, TransferLocked, WithdrawalLocked } from '../../modules';

const WalletCashierContent = () => {
    const history = useHistory();

    const isDeposit = useRouteMatch('/wallet/deposit');
    const isFiatOnRamp = useRouteMatch('/wallet/on-ramp');
    const isResetBalance = useRouteMatch('/wallet/reset-balance');
    const isTransfer = useRouteMatch('/wallet/account-transfer');
    const isTransactions = useRouteMatch('/wallet/transactions');
    const isWithdraw = useRouteMatch('/wallet/withdrawal');

    useEffect(() => {
        // redirect to deposit page if no other page is matched
        if (!isTransfer && !isDeposit && !isTransactions && !isWithdraw && !isResetBalance && !isFiatOnRamp) {
            history.push('/wallet/deposit');
        }
    }, [isTransfer, isDeposit, isTransactions, isWithdraw, isResetBalance, isFiatOnRamp, history]);

    if (isDeposit)
        return (
            <CashierLocked module='deposit'>
                <DepositLocked>
                    <WalletDeposit />
                </DepositLocked>
            </CashierLocked>
        );

    if (isFiatOnRamp)
        return (
            <CashierLocked module='deposit'>
                <WalletFiatOnRamp />
            </CashierLocked>
        );

    if (isResetBalance) return <WalletResetBalance />;

    if (isTransfer)
        return (
            <CashierLocked module='transfer'>
                <TransferLocked>
                    <WalletTransfer />
                </TransferLocked>
            </CashierLocked>
        );

    if (isTransactions) return <WalletTransactions />;

    if (isWithdraw) {
        return (
            <CashierLocked module='withdrawal'>
                <WithdrawalLocked>
                    <WalletWithdrawal />
                </WithdrawalLocked>
            </CashierLocked>
        );
    }

    return <></>;
};

export default WalletCashierContent;
