import React, { useEffect, useState } from 'react';
import { Field, FieldProps } from 'formik';
import './WithdrawalCryptoAmountConverter.scss';
import { WalletTextField } from '../../../../../../../../components';
import ArrowBold from '../../../../../../../../public/images/arrow-bold.svg';
import { useActiveWalletAccount, useExchangeRate } from '@deriv/api';
import classNames from 'classnames';

const errorMessageMapper = {
    invalidInput: 'Should be a valid number.',
    insufficientFunds: 'Insufficient funds',
    withdrawalLimit: (min: number, max: number, currency: string) =>
        `The current allowed withdraw amount is ${min} to ${max} BTC ${currency}.`,
};

const WithdrawalCryptoAmountConverter = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const [cryptoAmount, setCryptoAmount] = useState<number | undefined>();
    const [fiatAmount, setFiatAmount] = useState<number | undefined>();
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const [isCryptoInputActive, SetIsCryptoInputActive] = useState(false);

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (cryptoAmount && exchangeRate?.rates && activeWallet?.currency)
            setFiatAmount(cryptoAmount / exchangeRate?.rates[activeWallet?.currency]);
        else setFiatAmount(undefined);
    }, [cryptoAmount]);

    useEffect(() => {
        if (fiatAmount && exchangeRate?.rates && activeWallet?.currency)
            setCryptoAmount(fiatAmount * exchangeRate?.rates[activeWallet?.currency]);
        else setCryptoAmount(undefined);
    }, [fiatAmount]);

    return (
        <fieldset>
            <div className='wallets-withdrawal-crypto-amount-converter'>
                <Field>
                    {({ field }: FieldProps<string>) => (
                        <WalletTextField
                            {...field}
                            helperMessage={
                                activeWallet?.balance < cryptoAmount ? errorMessageMapper.insufficientFunds : ''
                            }
                            label={`Amount (${activeWallet?.currency})`}
                            name='wallets-withdrawal-crypto-cryptocurrency-textfield'
                            onFocus={() => SetIsCryptoInputActive(true)}
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
                <Field>
                    {({ field }: FieldProps<string>) => (
                        <WalletTextField
                            {...field}
                            helperMessage='Approximate value'
                            label='Amount (USD)'
                            name='wallets-withdrawal-crypto-usd-textfield'
                            onFocus={() => SetIsCryptoInputActive(false)}
                        />
                    )}
                </Field>
            </div>
        </fieldset>
    );
};

export default WithdrawalCryptoAmountConverter;
