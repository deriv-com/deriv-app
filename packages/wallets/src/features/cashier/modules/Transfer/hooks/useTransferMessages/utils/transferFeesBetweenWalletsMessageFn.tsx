import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMessageFnProps } from '../../../types';

const transferFeesBetweenWalletsMessageFn = ({
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

    const message = (
        <Localize i18n_default_text='There might be an adjustment to reflect the bid-ask value in the market.' />
    );

    return {
        message,
        type: 'info' as const,
    };
};

export default transferFeesBetweenWalletsMessageFn;
