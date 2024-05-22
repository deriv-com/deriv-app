import React, { useState } from 'react';
import clsx from 'clsx';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Input } from '@deriv-com/ui';
import ArrowBold from '../../../../../../assets/images/back-arrow.svg';
import { useWithdrawalCryptoContext } from '../../../../provider';
import type { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import styles from './WithdrawalCryptoAmountConverter.module.scss';

const WithdrawalCryptoAmountConverter: React.FC = () => {
    const {
        accountLimits,
        activeAccount,
        cryptoConfig,
        fractionalDigits,
        getConvertedCryptoAmount,
        getConvertedFiatAmount,
        isClientVerified,
    } = useWithdrawalCryptoContext();

    const [isCryptoInputActive, setIsCryptoInputActive] = useState(true);
    const { errors, setValues } = useFormikContext<TWithdrawalForm>();

    const onChangeCryptoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = !validateCryptoInput(
            activeAccount,
            fractionalDigits,
            isClientVerified,
            accountLimits?.remainder ?? 0,
            e.target.value,
            cryptoConfig?.minimum_withdrawal
        )
            ? getConvertedFiatAmount(e.target.value)
            : '';

        setValues(values => ({
            ...values,
            cryptoAmount: e.target.value,
            fiatAmount: convertedValue,
        }));
    };

    const onChangeFiatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = !validateFiatInput(fractionalDigits, e.target.value)
            ? getConvertedCryptoAmount(e.target.value)
            : '';

        setValues(values => ({
            ...values,
            cryptoAmount: convertedValue,
            fiatAmount: e.target.value,
        }));
    };

    return (
        <div className={styles.container}>
            <Field
                name='cryptoAmount'
                validate={(value: string) =>
                    validateCryptoInput(
                        activeAccount,
                        fractionalDigits,
                        isClientVerified,
                        accountLimits?.remainder ?? 0,
                        value
                    )
                }
            >
                {({ field }: FieldProps<string>) => (
                    <Input
                        {...field}
                        data-testid='dt_withdrawal_crypto_amount_input'
                        error={Boolean(errors.cryptoAmount)}
                        label={`Amount (${activeAccount?.currency})`}
                        message={errors.cryptoAmount}
                        onChange={onChangeCryptoInput}
                        onFocus={() => setIsCryptoInputActive(true)}
                    />
                )}
            </Field>
            <div className={clsx(styles.arrow, { [styles['arrow-rtl']]: !isCryptoInputActive })}>
                <ArrowBold />
            </div>
            <Field name='fiatAmount' validate={(value: string) => validateFiatInput(fractionalDigits, value)}>
                {({ field }: FieldProps<string>) => (
                    <Input
                        {...field}
                        data-testid='dt_withdrawal_fiat_amount_input'
                        error={Boolean(errors.fiatAmount)}
                        label='Amount (USD)'
                        message={errors.fiatAmount ?? 'Approximate value'}
                        onChange={onChangeFiatInput}
                        onFocus={() => setIsCryptoInputActive(false)}
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
