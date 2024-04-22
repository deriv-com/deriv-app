import React from 'react';
import { useFormikContext } from 'formik';
import { CryptoFiatConverter } from '../../../../../../components';
import { DeepNonNullable, TCurrency } from '../../../../../../types';
import { TTransferFormikContext } from '../../../../types';

type TLimits = {
    max: number;
    min: number;
};

const TransferCryptoFiatAmountConverter = () => {
    const { values } = useFormikContext<DeepNonNullable<TTransferFormikContext>>();

    const getMinMaxLimits = () => {
        const {
            limits,
            limits_ctrader: limitsCTrader,
            limits_dxtrade: limitsDXTrade,
            limits_mt5: limitsMT5,
        } = values.fromAccount.currencyConfig.transfer_between_accounts;

        switch (values.fromAccount.account_type) {
            case 'ctrader':
                return {
                    max: limitsCTrader.max,
                    min: limitsCTrader.min,
                } as TLimits;
            case 'dxtrade':
                return {
                    max: limitsDXTrade.max,
                    min: limitsDXTrade.min,
                } as TLimits;
            case 'mt5':
                return {
                    max: limitsMT5.max,
                    min: limitsMT5.min,
                } as TLimits;
            default:
                return {
                    max: limits.max,
                    min: limits.min,
                } as TLimits;
        }
    };

    const modifiedFromAccount = {
        balance: parseFloat(values.fromAccount.balance),
        currency: values.fromAccount.currency as TCurrency,
        displayBalance: values.fromAccount.displayBalance,
        fractionalDigits: values.fromAccount.currencyConfig.fractional_digits,
        limits: getMinMaxLimits(),
    };

    const modifiedToAccount = {
        currency: values.toAccount.currency as TCurrency,
        fractionalDigits: values.toAccount.currencyConfig.fractional_digits,
    };

    return <CryptoFiatConverter fromAccount={modifiedFromAccount} toAccount={modifiedToAccount} />;
};

export default TransferCryptoFiatAmountConverter;
