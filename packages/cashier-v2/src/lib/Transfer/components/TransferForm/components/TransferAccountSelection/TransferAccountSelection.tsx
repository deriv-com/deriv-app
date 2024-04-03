import React, { useCallback, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTransfer } from '../../../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../types';
import { TransferDropdown } from './components';
import styles from './TransferAccountSelection.module.scss';

const TransferAccountSelection = () => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const { accounts, isLoading, setTransferValidationSchema } = useTransfer();

    useEffect(() => {
        if (!isLoading) {
            setTransferValidationSchema(values.fromAccount, values.toAccount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, values.fromAccount, values.toAccount]);

    const onSelectFromAccount = useCallback(
        (account: TTransferableAccounts[number]) => {
            if (account.loginid === values.toAccount.loginid)
                setValues(currentValues => ({
                    ...currentValues,
                    fromAccount: currentValues.toAccount,
                    toAccount: currentValues.fromAccount,
                }));
            else setValues(currentValues => ({ ...currentValues, fromAccount: account }));
        },
        [setValues, values.toAccount.loginid]
    );

    const onSelectToAccount = useCallback(
        (account: TTransferableAccounts[number]) => {
            if (account.loginid === values.fromAccount.loginid)
                setValues(currentValues => ({
                    ...currentValues,
                    fromAccount: currentValues.toAccount,
                    toAccount: currentValues.fromAccount,
                }));
            else setValues(currentValues => ({ ...currentValues, toAccount: account }));
        },
        [setValues, values.fromAccount.loginid]
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
                accounts={accounts?.filter(account => account.loginid !== values.fromAccount.loginid)}
                label='To'
                onSelect={onSelectToAccount}
                value={values.toAccount}
            />
        </div>
    );
};

export default TransferAccountSelection;
