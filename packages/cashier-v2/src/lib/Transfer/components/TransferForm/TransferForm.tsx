import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Text } from '@deriv-com/ui';
import { cashierPathRoutes } from '../../../../routes/Router';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();

    return (
        <Formik
            initialValues={{
                cryptoAmount: '',
                fiatAmount: '',
            }}
        >
            {() => {
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferFormAccountSelection />
                        <TransferAmountConverter />
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
