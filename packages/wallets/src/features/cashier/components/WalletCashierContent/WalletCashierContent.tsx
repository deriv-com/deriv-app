import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { WalletDeposit } from '../../flows/WalletDeposit';
import { WalletFiatOnRamp } from '../../flows/WalletFiatOnRamp';
import { WalletResetBalance } from '../../flows/WalletResetBalance';
import { WalletTransactions } from '../../flows/WalletTransactions';
import { WalletTransfer } from '../../flows/WalletTransfer';
import { WalletWithdrawal } from '../../flows/WalletWithdrawal';
import { CashierLocked, DepositLocked, WithdrawalLocked } from '../../modules';

const WalletCashierContent = () => {
    const history = useHistory();

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
            <CashierLocked>
                <WalletTransfer />
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
