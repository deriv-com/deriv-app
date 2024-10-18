import { lazy } from 'react';

const LazyDepositLocked = lazy(
    () => import(/* webpackChunkName: "deposit-locked" */ '../../modules/DepositLocked/DepositLocked')
);
const LazyWalletDeposit = lazy(
    () => import(/* webpackChunkName: "wallet-deposit" */ '../../flows/WalletDeposit/WalletDeposit')
);
const LazyWalletFiatOnRamp = lazy(
    () => import(/* webpackChunkName: "wallet-fiat-onramp" */ '../../flows/WalletFiatOnRamp/WalletFiatOnRamp')
);
const LazyWalletResetBalance = lazy(
    () => import(/* webpackChunkName: "wallet-reset-balance" */ '../../flows/WalletResetBalance/WalletResetBalance')
);
const LazyWalletTransfer = lazy(
    () => import(/* webpackChunkName: "wallet-transfer" */ '../../flows/WalletTransfer/WalletTransfer')
);
const LazyWalletTransactions = lazy(
    () => import(/* webpackChunkName: "wallet-transactions" */ '../../flows/WalletTransactions/WalletTransactions')
);
const LazyWithdrawalLocked = lazy(
    () => import(/* webpackChunkName: "withdrawal-locked" */ '../../modules/WithdrawalLocked/WithdrawalLocked')
);
const LazyWalletWithdrawal = lazy(
    () => import(/* webpackChunkName: "wallet-withdrawal" */ '../../flows/WalletWithdrawal/WalletWithdrawal')
);

export {
    LazyDepositLocked,
    LazyWalletDeposit,
    LazyWalletFiatOnRamp,
    LazyWalletResetBalance,
    LazyWalletTransactions,
    LazyWalletTransfer,
    LazyWalletWithdrawal,
    LazyWithdrawalLocked,
};
