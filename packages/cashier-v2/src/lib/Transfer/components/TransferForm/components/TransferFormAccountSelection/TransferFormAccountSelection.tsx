import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { TTransferableAccounts, TTransferFormikContext } from 'src/lib/Transfer/types';
import { TCurrency } from '../../../../../../types';
import { useTransfer } from '../../../../provider';
import { getTransferValidationSchema } from '../../../../utils';
import { TransferAccountTile } from './components/TransferAccountTile';
import { TransferDropdown } from './components/TransferDropdown';
import styles from './TransferFormAccountSelection.module.scss';

const getInitialToAccount = (accounts: TTransferableAccounts, activeAccount: TTransferableAccounts[number]) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

const getValidationSchema = (fromAccount: TTransferableAccounts[number], toAccount: TTransferableAccounts[number]) => {
    if (!fromAccount.currencyConfig) return;

    const limits =
        fromAccount.currencyConfig.transfer_between_accounts[
            // eslint-disable-next-line sonarjs/no-nested-template-literals
            `limits${fromAccount.account_type !== 'binary' ? `_${fromAccount.account_type}` : ''}`
        ];

    return getTransferValidationSchema({
        fromAccount: {
            balance: parseFloat(fromAccount?.balance ?? '0'),
            currency: fromAccount?.currency as TCurrency,
            fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
            limits,
        },
        toAccount: {
            currency: toAccount?.currency as TCurrency,
            fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
        },
    });
};

const TransferFormAccountSelection = ({
    setValidationSchema,
}: {
    setValidationSchema: React.Dispatch<React.SetStateAction<ReturnType<typeof getTransferValidationSchema>>>;
}) => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const { accounts, activeAccount, isLoading } = useTransfer();

    useEffect(() => {
        if (accounts && activeAccount && !isLoading) {
            const fromAccount = activeAccount;
            const toAccount = getInitialToAccount(accounts, activeAccount);
            setValues(currentValues => ({
                ...currentValues,
                fromAccount,
                toAccount,
            }));
            setValidationSchema(getValidationSchema(fromAccount, toAccount));
        }
    }, [isLoading]);

    return (
        <div className={styles.container}>
            <TransferDropdown
                content={<TransferAccountTile account={values.fromAccount} />}
                isFullWidth
                label='From'
                list={() =>
                    accounts?.map(account => {
                        return {
                            listItem: <TransferAccountTile account={account} />,
                            account_type: account.account_type,
                            value: account.loginid,
                        };
                    })
                }
                onSelect={loginid => {
                    setValues(currentValues => ({
                        ...currentValues,
                        fromAccount: accounts?.find(account => account.loginid === loginid),
                    }));
                }}
                value={values.fromAccount.loginid}
            />
            <TransferDropdown
                content={<TransferAccountTile account={values.toAccount} />}
                isFullWidth
                label='To'
                list={() =>
                    accounts?.map(account => {
                        return {
                            listItem: <TransferAccountTile account={account} />,
                            account_type: account.account_type,
                            value: account.loginid,
                        };
                    })
                }
                onSelect={loginid => {
                    setValues(currentValues => ({
                        ...currentValues,
                        toAccount: accounts?.find(account => account.loginid === loginid),
                    }));
                }}
                value={values.toAccount.loginid}
            />
        </div>
    );
};

export default TransferFormAccountSelection;
