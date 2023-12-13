import { useCallback } from 'react';
import { useAccountLimits, useActiveWalletAccount, useAuthorize, usePOI } from '@deriv/api';
import { displayMoney as displayMoney_ } from '@deriv/api/src/utils';
import { THooks } from '../../../../../../types';
import { TAccount, TInitialTransferFormValues } from '../../types';
import {
    cumulativeAccountLimitsMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
} from './utils/messageFunctions';
import { TMessage, TMessageFnProps } from './types';

const useTransferMessages = (
    fromAccount: NonNullable<TAccount> | undefined,
    toAccount: NonNullable<TAccount> | undefined,
    formData: TInitialTransferFormValues,
    exchangeRatesUSD?: THooks.ExchangeRate,
    exchangeRatesWalletCurrency?: THooks.ExchangeRate
) => {
    const { data: authorizeData } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { preferred_language: preferredLanguage } = authorizeData;
    const { data: poi } = usePOI();
    const { data: accountLimits } = useAccountLimits();

    const isTransferBetweenWallets =
        fromAccount?.account_category === 'wallet' && toAccount?.account_category === 'wallet';
    const isAccountVerified = poi?.is_verified;

    const displayMoney = useCallback(
        (amount: number, currency: string, fractionalDigits: number) =>
            displayMoney_(amount, currency, {
                fractional_digits: fractionalDigits,
                preferred_language: preferredLanguage,
            }),
        [preferredLanguage]
    );

    if (!activeWallet || !fromAccount || !toAccount) return [];

    const sourceAmount = formData.fromAmount;

    const messageFns: ((props: TMessageFnProps) => TMessage | null)[] = [];
    const messages: TMessage[] = [];

    if (isAccountVerified || (!isAccountVerified && !isTransferBetweenWallets)) {
        messageFns.push(cumulativeAccountLimitsMessageFn);
    }
    if (!isAccountVerified && isTransferBetweenWallets) {
        messageFns.push(lifetimeAccountLimitsBetweenWalletsMessageFn);
    }

    messageFns.forEach(messageFn => {
        const message = messageFn({
            activeWallet,
            displayMoney,
            exchangeRatesUSD,
            exchangeRatesWalletCurrency,
            limits: accountLimits,
            sourceAccount: fromAccount,
            sourceAmount,
            targetAccount: toAccount,
        });
        if (message) messages.push(message);
    });

    return messages;
};

export default useTransferMessages;
