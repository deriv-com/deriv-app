import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { cashierPathRoutes } from '../../../../routes/Router';
import { useTransfer } from '../../provider';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accounts, fromAccount, isLoading, setFromAccount, toAccount, validationSchema } = useTransfer();

    if (isLoading) return <Loader />;

    return (
        <Formik
            initialValues={{
                fromAmount: '',
                toAmount: '',
            }}
            validationSchema={validationSchema}
        >
            {({ errors, handleChange }) => {
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferFormAccountSelection />
                        <TransferAmountConverter fromAccount={fromAccount} toAccount={toAccount} />
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
                            <Button onClick={() => history.push(cashierPathRoutes.cashierDeposit)} size='lg'>
                                Transfer
                            </Button>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default TransferForm;
