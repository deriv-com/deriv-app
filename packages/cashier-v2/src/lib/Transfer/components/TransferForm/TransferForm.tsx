import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { getCryptoFiatConverterValidationSchema } from '../../../../components';
import type { TCurrency } from '../../../../types';
import { useTransfer } from '../../provider';
import { TTransferFormikContext } from '../../types';
import { TransferAccountSelection, TransferCryptoFiatAmountConverter } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accounts, activeAccount, isLoading } = useTransfer();
    const [validationSchema, setValidationSchema] =
        useState<ReturnType<typeof getCryptoFiatConverterValidationSchema>>();

    const getInitialToAccount = useMemo(() => {
        if (!accounts || !activeAccount) return;

        if (activeAccount !== accounts[0]) return accounts[0];

        return accounts[1];
    }, [accounts, activeAccount]);

    useEffect(() => {
        if (accounts)
            setValidationSchema(
                getCryptoFiatConverterValidationSchema({
                    fromAccount: {
                        balance: parseFloat(activeAccount?.balance ?? ''),
                        currency: activeAccount?.currency as TCurrency,
                        fractionalDigits: activeAccount?.currencyConfig?.fractional_digits,
                        limits: {
                            max: 100,
                            min: 1,
                        },
                    },
                    toAccount: {
                        currency: getInitialToAccount?.currency as TCurrency,
                        fractionalDigits: getInitialToAccount?.currencyConfig?.fractional_digits,
                    },
                })
            );
    }, [
        accounts,
        activeAccount?.balance,
        activeAccount?.currency,
        activeAccount?.currencyConfig?.fractional_digits,
        getInitialToAccount?.currency,
        getInitialToAccount?.currencyConfig?.fractional_digits,
    ]);

    if (!accounts || !activeAccount || isLoading || !getInitialToAccount) return <Loader />;

    const initialValues: TTransferFormikContext = {
        fromAccount: activeAccount,
        fromAmount: '',
        toAccount: getInitialToAccount,
        toAmount: '',
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                return undefined;
            }}
            validationSchema={validationSchema}
        >
            {() => {
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferAccountSelection />
                        <TransferCryptoFiatAmountConverter />
                        <div className={styles['button-group']}>
                            <Button
                                onClick={() => {
                                    history.push('/cashier-v2/deposit');
                                }}
                                size='lg'
                                variant='outlined'
                            >
                                Deposit
                            </Button>
                            <Button size='lg'>Transfer</Button>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default TransferForm;
