import React, { useState } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { cashierPathRoutes } from '../../../../routes/Router';
import { useTransfer } from '../../provider';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { isLoading } = useTransfer();
    const [validationSchema, setValidationSchema] = useState();

    if (isLoading) return <Loader />;

    return (
        <Formik
            initialValues={{
                fromAccount: {},
                fromAmount: '',
                toAccount: {},
                toAmount: '',
            }}
            validationSchema={validationSchema}
        >
            {({ errors, setValues, values }) => {
                // console.log('=> values', values);
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferFormAccountSelection setValidationSchema={setValidationSchema} />
                        <TransferAmountConverter errors={errors} setValues={setValues} values={values} />
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
