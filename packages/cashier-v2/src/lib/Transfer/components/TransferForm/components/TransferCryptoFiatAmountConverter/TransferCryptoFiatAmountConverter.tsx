import React from 'react';
import { useFormikContext } from 'formik';
import { CryptoFiatConverter } from '../../../../../../components';
import { DeepNonNullable, TCurrency } from '../../../../../../types';
import { useTransfer } from '../../../../provider';
import { TTransferFormikContext } from '../../../../types';

const TransferCryptoFiatAmountConverter = () => {
    const { values } = useFormikContext<DeepNonNullable<TTransferFormikContext>>();
    const { exchangeRates } = useTransfer();

    const modifiedFromAccount = {
        balance: parseFloat(values.fromAccount.balance),
        currency: values.fromAccount.currency as TCurrency,
        displayBalance: values.fromAccount.displayBalance,
        fractionalDigits: values.fromAccount.currencyConfig.fractional_digits,
        limits: values.fromAccount.limits,
    };

    const modifiedToAccount = {
        currency: values.toAccount.currency as TCurrency,
        fractionalDigits: values.toAccount.currencyConfig.fractional_digits,
    };

    return (
        <CryptoFiatConverter
            exchangeRates={exchangeRates}
            fromAccount={modifiedFromAccount}
            toAccount={modifiedToAccount}
        />
    );
};

export default TransferCryptoFiatAmountConverter;
