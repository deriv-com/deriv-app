import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { TCurrency } from '../../../../../../types';
import { useTransfer } from '../../../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../types';
import { TransferDropdown } from './components';
import styles from './TransferAccountSelection.module.scss';

type TProps = {
    fromAccountLimit?: number;
};

const TransferAccountSelection: React.FC<TProps> = ({ fromAccountLimit }) => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const { accountLimits, accounts, refetchAccountLimits, setTransferValidationSchema, subscribeToExchangeRate } =
        useTransfer();

    const { fromAccount, toAccount } = values;
    const filteredToAccounts = accounts?.filter(account => account.loginid !== fromAccount?.loginid);

    useEffect(() => {
        if (fromAccount && toAccount) {
            setTransferValidationSchema(fromAccount, toAccount);
            refetchAccountLimits();
        }
    }, [fromAccount, toAccount, setTransferValidationSchema, refetchAccountLimits]);

    useEffect(() => {
        if (fromAccount && toAccount && fromAccount.currency !== toAccount.currency) {
            subscribeToExchangeRate(
                fromAccount?.currency as TCurrency,
                toAccount?.currency as TCurrency,
                fromAccount.loginid
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromAccount, toAccount]);

    const onSelectFromAccount = (account: TTransferableAccounts[number]) => {
        if (account.loginid === toAccount?.loginid)
            setValues(currentValues => ({
                ...currentValues,
                fromAccount: currentValues.toAccount,
                toAccount: currentValues.fromAccount,
            }));
        else setValues(currentValues => ({ ...currentValues, fromAccount: account }));
    };

    const onSelectToAccount = (account: TTransferableAccounts[number]) => {
        setValues(currentValues => ({ ...currentValues, toAccount: account }));
    };

    const dailyTransferLimitMessage =
        accountLimits?.daily_transfers && fromAccount?.account_type
            ? `You have ${fromAccountLimit} transfers remaining for today.`
            : '';

    return (
        <div className={styles.container}>
            <TransferDropdown accounts={accounts} label='From' onSelect={onSelectFromAccount} value={fromAccount} />
            <TransferDropdown
                accounts={filteredToAccounts}
                label='To'
                message={dailyTransferLimitMessage}
                onSelect={onSelectToAccount}
                value={toAccount}
            />
        </div>
    );
};

export default TransferAccountSelection;
