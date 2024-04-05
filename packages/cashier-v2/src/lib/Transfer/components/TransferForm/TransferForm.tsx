import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { useTransfer } from '../../provider';
import { TTransferFormikContext } from '../../types';
import { TransferAccountSelection, TransferCryptoFiatAmountConverter } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accounts, activeAccount, isLoading, transferValidationSchema } = useTransfer();

    const initialToAccount = useMemo(() => {
        if (!accounts || !activeAccount) return;

        if (activeAccount !== accounts[0]) return accounts[0];

        return accounts[1];
    }, [accounts, activeAccount]);

    if (!accounts || !activeAccount || isLoading || !initialToAccount) return <Loader />;

    const initialValues: TTransferFormikContext = {
        fromAccount: activeAccount,
        fromAmount: '',
        toAccount: initialToAccount,
        toAmount: '',
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                return undefined;
            }}
            validationSchema={transferValidationSchema}
        >
            {() => {
                return (
                    <form className={styles.container}>
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
                    </form>
                );
            }}
        </Formik>
    );
};

export default TransferForm;
