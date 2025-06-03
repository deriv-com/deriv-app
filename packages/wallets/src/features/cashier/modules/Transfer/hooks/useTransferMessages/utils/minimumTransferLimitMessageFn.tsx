import React from 'react';
import { Localize } from '@deriv-com/translations';
import { TMessageFnProps } from '../../../types';

const minimumTransferLimitMessageFn = ({
    displayMoney,
    sourceAccount,
    sourceAmount,
    targetAccount,
}: TMessageFnProps) => {
    if (!sourceAccount || !targetAccount || !sourceAmount) return null;

    // Determine the account type for limit selection
    const isCtraderTransfer = [sourceAccount, targetAccount].some(acc => acc.account_type === 'ctrader');
    const isMT5Transfer = [sourceAccount, targetAccount].some(acc => acc.account_type === 'mt5');
    const isDxtradeTransfer = [sourceAccount, targetAccount].some(acc => acc.account_type === 'dxtrade');

    // Get the appropriate minimum limit based on account types
    let minLimit;
    if (isCtraderTransfer) {
        minLimit = sourceAccount.currencyConfig?.transfer_between_accounts?.limits_ctrader?.min;
    } else if (isMT5Transfer) {
        minLimit = sourceAccount.currencyConfig?.transfer_between_accounts?.limits_mt5?.min;
    } else if (isDxtradeTransfer) {
        minLimit = sourceAccount.currencyConfig?.transfer_between_accounts?.limits_dxtrade?.min;
    } else {
        minLimit = sourceAccount.currencyConfig?.transfer_between_accounts?.limits?.min;
    }

    // If min limit is not available or amount is greater than or equal to min limit, return null
    if (!minLimit || typeof minLimit !== 'number' || sourceAmount >= minLimit) return null;

    // Format the minimum limit for display
    const formattedMinLimit = displayMoney?.(
        minLimit,
        sourceAccount.currency || '',
        sourceAccount.currencyConfig?.fractional_digits || 2
    );

    // Create a single message format for all transfer types
    const message = (
        <Localize
            i18n_default_text='Minimum required amount is {{formattedMinLimit}}'
            values={{
                formattedMinLimit,
            }}
        />
    );

    return {
        message,
        type: 'error' as const,
    };
};

export default minimumTransferLimitMessageFn;
