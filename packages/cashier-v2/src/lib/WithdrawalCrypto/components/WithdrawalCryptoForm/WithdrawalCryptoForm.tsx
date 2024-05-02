import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { Button, Input } from '@deriv-com/ui';
import { useWithdrawalCryptoContext } from '../../provider';
import { validateCryptoAddress } from '../../utils';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import { WithdrawalCryptoPercentageSelector } from './components/WithdrawalCryptoPercentageSelector';
import styles from './WithdrawalCryptoForm.module.scss';

const WithdrawalCryptoForm: React.FC = () => {
    const { activeAccount, fractionalDigits, isWithdrawalError, requestCryptoWithdrawal } =
        useWithdrawalCryptoContext();

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
            }}
            onSubmit={values =>
                requestCryptoWithdrawal({
                    address: values.cryptoAddress,
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(fractionalDigits.crypto)),
                })
            }
        >
            {({ errors, handleSubmit, isSubmitting, values }) => {
                const isSubmitButtonDisabled =
                    Object.keys(errors).length !== 0 || !values.cryptoAmount || (isSubmitting && !isWithdrawalError);

                return (
                    <form autoComplete='off' className={styles.container} onSubmit={handleSubmit}>
                        <div className={styles['crypto-address']}>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <Input
                                        {...field}
                                        data-testid='dt_withdrawal_crypto_address_input'
                                        error={Boolean(errors?.cryptoAddress)}
                                        isFullWidth
                                        label={`Your ${activeAccount?.currency_config?.name} cryptocurrency wallet address`}
                                        message={errors.cryptoAddress}
                                    />
                                )}
                            </Field>
                        </div>
                        <WithdrawalCryptoPercentageSelector />
                        <WithdrawalCryptoAmountConverter />
                        <div className={styles.submit}>
                            <Button
                                disabled={isSubmitButtonDisabled}
                                isLoading={isSubmitting && !isWithdrawalError}
                                size='lg'
                                type='submit'
                            >
                                Withdraw
                            </Button>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
