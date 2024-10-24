import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Loader } from '@deriv-com/ui';
import { CashierLocked } from '../../modules';
import {
    LazyDepositLocked,
    LazyWalletDeposit,
    LazyWalletFiatOnRamp,
    LazyWalletResetBalance,
    LazyWalletTransactions,
    LazyWalletTransfer,
    LazyWalletWithdrawal,
    LazyWithdrawalLocked,
} from './WalletCashierLazyRoutes';

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
                <React.Suspense fallback={<Loader />}>
                    <LazyDepositLocked>
                        <LazyWalletDeposit />
                    </LazyDepositLocked>
                </React.Suspense>
            </CashierLocked>
        );

    if (isFiatOnRamp)
        return (
            <CashierLocked module='deposit'>
                <React.Suspense fallback={<Loader />}>
                    <LazyWalletFiatOnRamp />
                </React.Suspense>
            </CashierLocked>
        );

    if (isResetBalance)
        return (
            <React.Suspense fallback={<Loader />}>
                <LazyWalletResetBalance />
            </React.Suspense>
        );

    if (isTransfer)
        return (
            <CashierLocked>
                <React.Suspense fallback={<Loader />}>
                    <LazyWalletTransfer />
                </React.Suspense>
            </CashierLocked>
        );

    if (isTransactions)
        return (
            <React.Suspense fallback={<Loader />}>
                <LazyWalletTransactions />
            </React.Suspense>
        );

    if (isWithdraw) {
        return (
            <CashierLocked module='withdrawal'>
                <React.Suspense fallback={<Loader />}>
                    <LazyWithdrawalLocked>
                        <LazyWalletWithdrawal />
                    </LazyWithdrawalLocked>
                </React.Suspense>
            </CashierLocked>
        );
    }

    return <></>;
};

export default WalletCashierContent;
