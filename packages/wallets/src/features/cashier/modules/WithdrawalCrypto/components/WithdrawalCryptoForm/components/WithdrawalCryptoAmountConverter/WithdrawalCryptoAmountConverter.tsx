import React, { useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { WalletTextField } from '../../../../../../../../components';
import ArrowBold from '../../../../../../../../public/images/ic-back-arrow.svg';
import { useWithdrawalCryptoValidator } from '../../../../hooks';
import { useWithdrawalCryptoContext } from '../../../../provider';
import type { TWithdrawalForm } from '../../../../types';
import './WithdrawalCryptoAmountConverter.scss';

const WithdrawalCryptoAmountConverter: React.FC = () => {
    const { activeWallet, fractionalDigits, getConvertedCryptoAmount, getConvertedFiatAmount } =
        useWithdrawalCryptoContext();
    const { validateCryptoInput, validateFiatInput } = useWithdrawalCryptoValidator(activeWallet, fractionalDigits);
    const [isCryptoInputActive, setIsCryptoInputActive] = useState(false);
    const { errors, setValues } = useFormikContext<TWithdrawalForm>();

    const onChangeCryptoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedFiatAmount(e.target.value);

        setValues(values => ({
            ...values,
            cryptoAmount: e.target.value,
            fiatAmount: convertedValue,
        }));
    };

    const onChangeFiatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const convertedValue = getConvertedCryptoAmount(e.target.value);

        setValues(values => ({
            ...values,
            cryptoAmount: convertedValue,
            fiatAmount: e.target.value,
        }));
    };

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <Field name='cryptoAmount' validate={validateCryptoInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
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
            >
                <ArrowBold />
            </div>
            <Field name='fiatAmount' validate={validateFiatInput}>
                {({ field }: FieldProps<string>) => (
                    <WalletTextField
                        {...field}
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
