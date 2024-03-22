import React from 'react';
import { useFormikContext } from 'formik';
import { CryptoFiatConverter } from '../../../../../../components';
import { TCurrency } from '../../../../../../types';
import { TTransferFormikContext } from '../../../../types';

type DeepNonNullable<T> = NonNullable<
    T extends object
        ? {
              [K in keyof T]-?: DeepNonNullable<T[K]>;
          }
        : NonNullable<T>
>;

const TransferCryptoFiatConverter = () => {
    const { values } = useFormikContext<DeepNonNullable<TTransferFormikContext>>();

    const modifiedFromAccount = {
        balance: parseFloat(values.fromAccount.balance),
        currency: values.fromAccount.currency as TCurrency,
        limits: {
            max: 100,
            min: 1,
        },
    };

    const modifiedToAccount = {
        currency: values.toAccount.currency as TCurrency,
        fractionalDigits: values.toAccount.currencyConfig?.fractional_digits,
    };

    return <CryptoFiatConverter fromAccount={modifiedFromAccount} toAccount={modifiedToAccount} />;
};

export default TransferCryptoFiatConverter;
