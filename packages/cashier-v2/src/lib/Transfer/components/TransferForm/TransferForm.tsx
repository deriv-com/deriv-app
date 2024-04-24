import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Button, InlineMessage, Text } from '@deriv-com/ui';
import { useTransfer } from '../../provider';
import { TTransferFormikContext } from '../../types';
import { TransferAccountSelection, TransferCryptoFiatAmountConverter } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accountLimits, accounts, activeAccount, isTransferring, requestForTransfer, transferValidationSchema } =
        useTransfer();

    const initialAccount = activeAccount !== accounts[0] ? accounts[0] : accounts[1];

    const initialValues: TTransferFormikContext = {
        fromAccount: activeAccount,
        fromAmount: '',
        toAccount: initialAccount,
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
            {({ errors, isSubmitting, values }) => {
                const getDailyTransferCountLimit = () => {
                    if (accountLimits?.daily_transfers && values.fromAccount?.account_type)
                        return values.fromAccount?.account_type === 'binary'
                            ? accountLimits?.daily_transfers.internal.available
                            : accountLimits?.daily_transfers[values.fromAccount?.account_type].available;
                };

                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        {!getDailyTransferCountLimit() && (
                            <InlineMessage type='filled' variant='warning'>
                                You have reached the maximum daily transfers. Please try again tomorrow.
                            </InlineMessage>
                        )}
                        <TransferAccountSelection fromAccountLimit={getDailyTransferCountLimit()} />
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
                            <Button
                                disabled={!!errors.fromAmount || !!errors.toAmount || !Number(values.fromAmount)}
                                isLoading={isSubmitting || isTransferring}
                                onClick={() => {
                                    requestForTransfer(
                                        Number(values.fromAmount).toFixed(
                                            values.fromAccount?.currencyConfig?.fractional_digits
                                        ),
                                        values.fromAccount,
                                        values.toAccount
                                    );
                                }}
                                role='submit'
                                size='lg'
                            >
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
