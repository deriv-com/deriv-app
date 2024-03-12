import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTransfer } from '../../../../provider';
import { getTransferValidationSchema } from '../../../../utils';
import { TransferAccountTile } from './components/TransferAccountTile';
// import { Dropdown } from '@deriv-com/ui';
import { TransferDropdown } from './components/TransferDropdown';
import styles from './TransferFormAccountSelection.module.scss';

const getInitialToAccount = (
    accounts: TExtendedTransferAccount['accounts'],
    activeAccount: TExtendedTransferAccount['activeAccount']
) => {
    if (!accounts || !activeAccount) return;

    if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

    return accounts[1];
};

const getValidationSchema = (fromAccount, toAccount) => {
    const limits =
        fromAccount.currencyConfig.transfer_between_accounts[
            `limits${fromAccount.account_type !== 'binary' ? fromAccount.account_type : ''}`
        ];

    return getTransferValidationSchema({
        fromAccount: {
            balance: parseFloat(fromAccount?.balance ?? '0'),
            currency: fromAccount?.currency,
            fractionalDigits: fromAccount?.currencyConfig?.fractional_digits,
            limits: {
                max: limits.max,
                min: limits.min,
            },
        },
        toAccount: {
            currency: toAccount?.currency,
            fractionalDigits: toAccount?.currencyConfig?.fractional_digits,
        },
    });
};

const TransferFormAccountSelection = ({ setValidationSchema }) => {
    const { setValues, values } = useFormikContext();
    const { accounts, activeAccount, isLoading, subscribeToExchangeRate, unSubscribeToExchangeRate } = useTransfer();

    // useEffect(() => {
    //     if (values.fromAccount.currency)
    //         subscribeToExchangeRate({
    //             base_currency: values.fromAccount.currency,
    //             target_currency: values.toAccount.currency,
    //         });
    //     return () => unSubscribeToExchangeRate();
    // }, [values.fromAccount, values.toAccount]);

    useEffect(() => {
        if (!isLoading) {
            const fromAccount = activeAccount;
            const toAccount = getInitialToAccount(accounts, activeAccount);
            setValues({
                fromAccount,
                toAccount,
            });
            setValidationSchema(getValidationSchema(activeAccount, toAccount));
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
                            text: account.loginid,
                            value: account.loginid,
                        };
                    })
                }
                name={undefined}
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
                        // console.log('=> render ', account);
                        return {
                            listItem: <TransferAccountTile account={account} />,
                            account_type: account.account_type,
                            value: account.loginid,
                        };
                    })
                }
                listHeader='Header'
                name={undefined}
                onSelect={loginid => {
                    setValues(currentValues => ({
                        ...currentValues,
                        toAccount: accounts?.find(account => account.loginid === loginid),
                    }));
                }}
                showListHeader
                value={values.toAccount.loginid}
            />
            {/* <Dropdown /> */}
            {/* <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={[
                    {
                        text: <TransferAccountTile />,
                        value: 'opt1',
                    },
                ]}
                name='transferFromDropdown'
                value='opt1'
            />
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                list={[
                    {
                        text: <div>yalla</div>,
                        value: 'yalla',
                    },
                ]}
                name='transferToDropdown'
            /> */}
        </div>
    );
};

export default TransferFormAccountSelection;
