import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { WalletTextField } from '../../../../../../../../components';
import ArrowBold from '../../../../../../../../public/images/ic-back-arrow.svg';
import { useWithdrawalCryptoInput } from '../../../../hooks';
import { useWithdrawalCryptoContext } from '../../../../provider';
import type { TWithdrawalForm } from '../../../../types';
import './WithdrawalCryptoAmountConverter.scss';

const WithdrawalCryptoAmountConverter: React.FC = () => {
    const { activeWallet, exchangeRates, getConvertedCryptoAmount, getConvertedFiatAmount } =
        useWithdrawalCryptoContext();
    const { validateCryptoInput, validateFiatInput } = useWithdrawalCryptoInput();
    const [isCryptoInputActive, setIsCryptoInputActive] = useState(false);
    const { errors, setValues, values } = useFormikContext<TWithdrawalForm>();

    useEffect(() => {
        // update the amount when the exchangeRate is updated.
        if (isCryptoInputActive)
            setValues({
                ...values,
                fiatAmount: getConvertedFiatAmount(values.cryptoAmount),
            });
        else
            setValues({
                ...values,
                cryptoAmount: getConvertedCryptoAmount(values.fiatAmount),
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet?.currency, exchangeRates?.data?.rates]);

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
