import React from 'react';
import { useFormikContext } from 'formik';
import { useTransfer } from '../../../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../types';
import { TransferDropdown } from './components';
import styles from './TransferAccountSelection.module.scss';

const getInitialToAccount = (accounts: TTransferableAccounts, activeAccount: TTransferableAccounts[number]) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

// const getValidationSchema = (fromAccount: TTransferableAccounts[number], toAccount: TTransferableAccounts[number]) => {
//     if (!fromAccount.currencyConfig) return;

//     const limits =
//         fromAccount.currencyConfig.transfer_between_accounts[
//             // eslint-disable-next-line sonarjs/no-nested-template-literals
//             `limits${fromAccount.account_type !== 'binary' ? `_${fromAccount.account_type}` : ''}`
//         ];

//     return getTransferValidationSchema({
//         fromAccount: {
//             balance: parseFloat(fromAccount?.balance ?? '0'),
//             currency: fromAccount?.currency as TCurrency,
//             fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
//             limits,
//         },
//         toAccount: {
//             currency: toAccount?.currency as TCurrency,
//             fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
//         },
//     });
// };

const TransferAccountSelection = () => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const { accounts, activeAccount, isLoading } = useTransfer();

    return (
        <div className={styles.container}>
            <TransferDropdown accounts={accounts} />
            <TransferDropdown accounts={accounts} />
        </div>
    );
};

export default TransferAccountSelection;
