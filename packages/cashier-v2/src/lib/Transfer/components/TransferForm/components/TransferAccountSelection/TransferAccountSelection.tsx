import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';
import { useTransfer } from '../../../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../types';
import { TransferDropdown } from './components';
import styles from './TransferAccountSelection.module.scss';

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
    const { accounts, isLoading } = useTransfer();

    const onSelectFromAccount = useCallback(
        (account: TTransferableAccounts[number]) => {
            if (account === values.toAccount)
                setValues(currentValues => ({
                    ...currentValues,
                    fromAccount: currentValues.toAccount,
                    toAccount: currentValues.fromAccount,
                }));
            else setValues(currentValues => ({ ...currentValues, fromAccount: account }));
        },
        [setValues, values.toAccount]
    );

    const onSelectToAccount = useCallback(
        (account: TTransferableAccounts[number]) => {
            if (account === values.fromAccount)
                setValues(currentValues => ({
                    ...currentValues,
                    fromAccount: currentValues.toAccount,
                    toAccount: currentValues.fromAccount,
                }));
            else setValues(currentValues => ({ ...currentValues, toAccount: account }));
        },
        [setValues, values.fromAccount]
    );

    if (isLoading) return null;

    return (
        <div className={styles.container}>
            <TransferDropdown
                accounts={accounts}
                label='From'
                onSelect={onSelectFromAccount}
                value={values.fromAccount}
            />
            <TransferDropdown
                accounts={accounts?.filter(account => account !== values.fromAccount)}
                label='To'
                onSelect={onSelectToAccount}
                value={values.toAccount}
            />
        </div>
    );
};

export default TransferAccountSelection;
