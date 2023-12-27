import { useCallback } from 'react';
import { useActiveWalletAccount, useAuthorize, usePOI } from '@deriv/api';
import { displayMoney as displayMoney_ } from '@deriv/api/src/utils';
import { THooks } from '../../../../../../types';
import { TAccount, TInitialTransferFormValues, TMessageFnProps, TTransferMessage } from '../../types';
import {
    cumulativeAccountLimitsMessageFn,
    insufficientBalanceMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
    transferFeesBetweenWalletsMessageFn,
} from './utils';

type TProps = {
    USDExchangeRates?: THooks.ExchangeRate;
    accountLimits?: THooks.AccountLimits;
    activeWalletExchangeRates?: THooks.ExchangeRate;
    formData: TInitialTransferFormValues;
    fromAccount: NonNullable<TAccount> | undefined;
    toAccount: NonNullable<TAccount> | undefined;
};

const useTransferMessages = ({
    USDExchangeRates,
    accountLimits,
    activeWalletExchangeRates,
    formData,
    fromAccount,
    toAccount,
}: TProps) => {
    const { data: authorizeData } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { preferred_language: preferredLanguage } = authorizeData;
    const { data: poi } = usePOI();

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

    if (!activeWallet || !fromAccount) return [];

    const sourceAmount = formData.fromAmount;

    const messageFns: ((props: TMessageFnProps) => TTransferMessage | null)[] = [];
    const messages: TTransferMessage[] = [];

    messageFns.push(insufficientBalanceMessageFn);

    if (isAccountVerified || (!isAccountVerified && !isTransferBetweenWallets)) {
        messageFns.push(cumulativeAccountLimitsMessageFn);
    }
    if (!isAccountVerified && isTransferBetweenWallets) {
        messageFns.push(lifetimeAccountLimitsBetweenWalletsMessageFn);
        messageFns.push(transferFeesBetweenWalletsMessageFn);
    }

    messageFns.forEach(messageFn => {
        const message = messageFn({
            activeWallet,
            activeWalletExchangeRates,
            displayMoney,
            limits: accountLimits,
            sourceAccount: fromAccount,
            sourceAmount,
            targetAccount: toAccount,
            USDExchangeRates,
        });
        if (message) messages.push(message);
    });

    if (messages.some(message => message.type === 'error')) {
        return messages.filter(message => message.type === 'error');
    }

    return messages;
};

export default useTransferMessages;
