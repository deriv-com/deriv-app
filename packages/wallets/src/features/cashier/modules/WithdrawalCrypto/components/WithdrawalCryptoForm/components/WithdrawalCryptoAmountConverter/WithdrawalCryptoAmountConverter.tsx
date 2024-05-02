import React, { useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { LegacyArrowRight2pxIcon } from '@deriv/quill-icons';
import { WalletTextField } from '../../../../../../../../components';
import { useWithdrawalCryptoContext } from '../../../../provider';
import type { TWithdrawalForm } from '../../../../types';
import { validateCryptoInput, validateFiatInput } from '../../../../utils';
import './WithdrawalCryptoAmountConverter.scss';

const WithdrawalCryptoAmountConverter: React.FC = () => {
    const {
        accountLimits,
        activeWallet,
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
            activeWallet,
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
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field
                name='cryptoAmount'
                validate={(value: string) =>
                    validateCryptoInput(
                        activeWallet,
                        fractionalDigits,
                        isClientVerified,
                        accountLimits?.remainder ?? 0,
                        value,
                        cryptoConfig?.minimum_withdrawal
                    )
                }
            >
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        data-testid='dt_withdrawal_crypto_amount_input'
                        errorMessage={errors.cryptoAmount}
                        isInvalid={Boolean(errors.cryptoAmount)}
                        label={`Amount (${activeWallet?.currency})`}
                        onChange={onChangeCryptoInput}
                        onFocus={() => setIsCryptoInputActive(true)}
                        showMessage
                    />
                )}
            </Field>
            <div
                className={classNames('wallets-withdrawal-crypto-amount-converter__arrow', {
                    'wallets-withdrawal-crypto-amount-converter__arrow--rtl': !isCryptoInputActive,
                })}
                data-testid='dt_withdrawal_crypto_amount_converter_arrow'
            >
                <LegacyArrowRight2pxIcon iconSize='xs' />
            </div>
            <Field name='fiatAmount' validate={(value: string) => validateFiatInput(fractionalDigits, value)}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
                        data-testid='dt_withdrawal_fiat_amount_input'
                        errorMessage={errors.fiatAmount}
                        isInvalid={Boolean(errors.fiatAmount)}
                        label='Amount (USD)'
                        message='Approximate value'
                        onChange={onChangeFiatInput}
                        onFocus={() => setIsCryptoInputActive(false)}
                        showMessage
                    />
                )}
            </Field>
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
