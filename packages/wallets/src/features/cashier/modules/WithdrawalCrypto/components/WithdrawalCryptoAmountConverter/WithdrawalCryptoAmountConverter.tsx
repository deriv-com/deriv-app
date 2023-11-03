import React, { useEffect, useState } from 'react';
import './WithdrawalCryptoAmountConverter.scss';
import { WalletTextField } from '../../../../../../components';
import ArrowBold from '../../../../../../public/images/arrow-bold.svg';
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
    const [cryptoAmount, setCryptoAmount] = useState<number>();
    const [convertedAmount, setConvertedAmount] = useState<string | undefined>();
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const [arrowPointsRtl, setArrowPointsRtl] = useState(false);

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: activeWallet?.currency,
                target_currency: 'USD',
            });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (cryptoAmount && exchangeRate?.rates)
            setConvertedAmount((cryptoAmount * exchangeRate?.rates.USD).toString());
        else setConvertedAmount('');
    }, [cryptoAmount]);

    return (
        <div className='wallets-withdrawal-crypto-amount-converter'>
            <WalletTextField
                helperMessage={
                    activeWallet && activeWallet?.balance < cryptoAmount ? errorMessageMapper.insufficientFunds : ''
                }
                label='Amount (BTC)'
                onChange={e => {
                    setCryptoAmount(parseFloat(e.target.value));
                }}
                onClick={() => setArrowPointsRtl(false)}
                showMessage
            />
            <div
                className={classNames('wallets-withdrawal-crypto-amount-converter__arrow', {
                    'wallets-withdrawal-crypto-amount-converter__arrow--rtl': arrowPointsRtl,
                })}
            >
                <ArrowBold />
            </div>
            <WalletTextField
                helperMessage='Approximate value'
                label='Amount (USD)'
                onClick={() => setArrowPointsRtl(true)}
                showMessage
                value={convertedAmount}
            />
        </div>
    );
};

export default WithdrawalCryptoAmountConverter;
