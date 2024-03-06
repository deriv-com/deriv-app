import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { cashierPathRoutes } from '../../../../routes/Router';
import { useTransfer } from '../../provider';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accounts, isLoading } = useTransfer();

    // console.log('=> form - accounts=', accounts);
    // console.log('=> form - isLoading=', isLoading);

    if (isLoading) return <Loader />;

    // console.log('=> form - fromAccount', fromAccount, ', toAccount', toAccount);

    return (
        <Formik
            initialValues={{
                fromAccount: {},
                fromAmount: '',
                toAccount: {},
                toAmount: '',
            }}
            // validationSchema={validationSchema}
        >
            {({ errors, values }) => {
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferFormAccountSelection />
                        <TransferAmountConverter errors={errors} values={values} />
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
