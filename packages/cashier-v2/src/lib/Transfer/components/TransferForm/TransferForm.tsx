import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Button, InlineMessage, Text } from '@deriv-com/ui';
import { useTransfer } from '../../provider';
import { TTransferFormikContext } from '../../types';
import { TransferAccountSelection, TransferCryptoFiatAmountConverter } from './components';
import styles from './TransferForm.module.scss';

type TAccountLimits = {
    allowed: number;
    available: number;
};

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

    const getDailyTransferCountLimit = (
        fromAccount: TTransferFormikContext['fromAccount'],
        toAccount: TTransferFormikContext['toAccount']
    ) => {
        if (accountLimits?.daily_transfers) {
            if (fromAccount?.account_type && fromAccount?.account_type !== 'binary') {
                return (accountLimits?.daily_transfers[fromAccount?.account_type] as TAccountLimits).available;
            } else if (toAccount?.account_type && toAccount?.account_type !== 'binary') {
                return (accountLimits?.daily_transfers[toAccount?.account_type] as TAccountLimits).available;
            }
            return (accountLimits?.daily_transfers.internal as TAccountLimits)?.available;
        }
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
                const isTransferDisabled =
                    !!errors.fromAmount ||
                    !!errors.toAmount ||
                    !Number(values.fromAmount) ||
                    !getDailyTransferCountLimit(values.fromAccount, values.toAccount);

                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        {!getDailyTransferCountLimit(values.fromAccount, values.toAccount) && (
                            <InlineMessage type='filled' variant='warning'>
                                You have reached the maximum daily transfers. Please try again tomorrow.
                            </InlineMessage>
                        )}
                        <TransferAccountSelection
                            fromAccountLimit={getDailyTransferCountLimit(values.fromAccount, values.toAccount)}
                        />
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
                                disabled={isTransferDisabled}
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
