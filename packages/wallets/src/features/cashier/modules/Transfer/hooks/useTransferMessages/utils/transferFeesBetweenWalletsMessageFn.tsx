import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMessageFnProps } from '../../../types';

const transferFeesBetweenWalletsMessageFn = ({
    displayMoney,
    fiatAccount,
    sourceAccount,
    sourceAmount,
    targetAccount,
    targetAmount,
}: TMessageFnProps) => {
    if (
        !sourceAccount.currency ||
        !sourceAccount.currencyConfig ||
        !sourceAmount ||
        !targetAmount ||
        !targetAccount?.currency
    )
        return null;

    const isTransferBetweenCryptoWallets =
        sourceAccount.account_type === 'crypto' && targetAccount.account_type === 'crypto';
    const minimumFeeAmount = 1 / 10 ** sourceAccount.currencyConfig.fractional_digits;

    const minimumFeeText = displayMoney?.(
        minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    const feePercentage = sourceAccount.currencyConfig?.transfer_between_accounts.fees[targetAccount.currency];

    const feeAmount = (feePercentage * sourceAmount) / 100;

    const feeMessageText = displayMoney?.(
        feeAmount > minimumFeeAmount ? feeAmount : minimumFeeAmount,
        sourceAccount.currency,
        sourceAccount.currencyConfig.fractional_digits
    );

    const message = isTransferBetweenCryptoWallets ? (
        <Localize
            i18n_default_text='Fee: {{feeMessageText}} ({{feePercentage}}% transfer fee or {{minimumFeeText}}, whichever is higher, applies for fund transfers between your cryptocurrency Wallets)'
            values={{
                feeMessageText,
                feePercentage,
                minimumFeeText,
            }}
        />
    ) : (
        <Localize
            i18n_default_text='Fee: {{feeMessageText}} ({{feePercentage}}% transfer fee or {{minimumFeeText}}, whichever is higher, applies for fund transfers between your {{currencyType}} Wallet and cryptocurrency Wallets)'
            values={{
                currencyType: fiatAccount?.wallet_currency_type,
                feeMessageText,
                feePercentage,
                minimumFeeText,
            }}
        />
    );

    return {
        message,
        type: 'info' as const,
    };
};

export default transferFeesBetweenWalletsMessageFn;
