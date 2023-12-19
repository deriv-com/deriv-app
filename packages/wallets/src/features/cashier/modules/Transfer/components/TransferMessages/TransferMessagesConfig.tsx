import React from 'react';
import { Trans } from 'react-i18next';
import type { TMessage } from '../../types';

export const TransferMessagesConfig = {
    CUMULATIVE_TRANSFER_LIMIT_ALLOWED: ({
        formattedSourceCurrencyLimit,
        isTransferBetweenWallets,
        sourceAccountName,
        targetAccountName,
    }: TMessage['values']) =>
        isTransferBetweenWallets ? (
            <Trans
                defaults='The daily transfer limit between your Wallets is {{formattedSourceCurrencyLimit}}.'
                values={{ formattedSourceCurrencyLimit }}
            />
        ) : (
            <Trans
                defaults='The daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyLimit}}.'
                values={{
                    formattedSourceCurrencyLimit,
                    sourceAccountName,
                    targetAccountName,
                }}
            />
        ),
    CUMULATIVE_TRANSFER_LIMIT_AVAILABLE: ({
        formattedSourceCurrencyRemainder,
        isTransferBetweenWallets,
        sourceAccountName,
        targetAccountName,
    }: TMessage['values']) =>
        isTransferBetweenWallets ? (
            <Trans
                defaults='The remaining daily transfer limit between Wallets is {{formattedSourceCurrencyRemainder}}.'
                values={{ formattedSourceCurrencyRemainder }}
            />
        ) : (
            <Trans
                defaults='The remaining daily transfer limit between your {{sourceAccountName}} and {{targetAccountName}} is {{formattedSourceCurrencyRemainder}}.'
                values={{
                    formattedSourceCurrencyRemainder,
                    sourceAccountName,
                    targetAccountName,
                }}
            />
        ),
    CUMULATIVE_TRANSFER_LIMIT_REACHED: ({
        formattedSourceCurrencyLimit,
        isTransferBetweenWallets,
        sourceAccountName,
        targetAccountName,
    }: TMessage['values']) =>
        isTransferBetweenWallets ? (
            <Trans
                defaults='You have reached your daily transfer limit of Wallets between your {{accounts}}. The limit will reset at 00:00 GMT.'
                values={{ formattedSourceCurrencyLimit }}
            />
        ) : (
            <Trans
                defaults='You have reached your daily transfer limit of {{formattedSourceCurrencyLimit}} between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.'
                values={{
                    formattedSourceCurrencyLimit,
                    sourceAccountName,
                    targetAccountName,
                }}
            />
        ),
    LIFETIME_TRANSFER_LIMIT_ALLOWED_CRYPTO: ({ formattedSourceCurrencyLimit }: TMessage['values']) => (
        <Trans
            defaults='The lifetime transfer limit between cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.'
            values={{ formattedSourceCurrencyLimit }}
        />
    ),
    LIFETIME_TRANSFER_LIMIT_ALLOWED_CRYPTO_AND_FIAT: ({ sourceAccountName, targetWalletType }: TMessage['values']) =>
        targetWalletType === 'crypto' ? (
            <Trans
                defaults='The lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.'
                values={{ sourceAccountName }}
            />
        ) : (
            <Trans
                defaults='The lifetime transfer limit from {{sourceAccountName}} to any fiat Wallets is up to {{formattedSourceCurrencyLimit}}.'
                values={{ sourceAccountName }}
            />
        ),
    LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO: ({ formattedSourceCurrencyLimit }: TMessage['values']) => (
        <Trans
            defaults='Your remaining lifetime transfer limit between cryptocurrency Wallets is {{formattedSourceCurrencyLimit}}. Verify your account to upgrade the limit.'
            values={{ formattedSourceCurrencyLimit }}
        />
    ),
    LIFETIME_TRANSFER_LIMIT_AVAILABLE_CRYPTO_AND_FIAT: ({
        formattedSourceCurrencyRemainder,
        sourceAccountName,
        targetWalletType,
    }: TMessage['values']) =>
        targetWalletType === 'crypto' ? (
            <Trans
                defaults='Your remaining lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.'
                values={{
                    formattedSourceCurrencyRemainder,
                    sourceAccountName,
                }}
            />
        ) : (
            <Trans
                defaults='Your remaining lifetime transfer limit from {{sourceAccountName}} to any fiat Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.'
                values={{
                    formattedSourceCurrencyRemainder,
                    sourceAccountName,
                }}
            />
        ),
    LIFETIME_TRANSFER_LIMIT_REACHED: ({ sourceAccountName, targetWalletType }: TMessage['values']) =>
        targetWalletType === 'crypto' ? (
            <Trans
                defaults="You've reached the lifetime transfer limit from your {{sourceAccountName}} to any cryptocurrency Wallet. Verify your account to upgrade the limit."
                values={{ sourceAccountName }}
            />
        ) : (
            <Trans
                defaults="You've reached the lifetime transfer limit from your {{sourceAccountName}} to any fiat Wallet. Verify your account to upgrade the limit."
                values={{ sourceAccountName }}
            />
        ),
    TRANSFER_FEE_BETWEEN_WALLETS: ({
        feeMessageText,
        feePercentage,
        minimumFeeText,
        targetAccountName,
    }: TMessage['values']) => (
        <Trans
            defaults='Fee: {{feeMessageText}} ({{feePercentage}}% transfer fee or {{minimumFeeText}}, whichever is higher, applies for fund transfers between your {{targetAccountName}} and cryptocurrency Wallets)'
            values={{ feeMessageText, feePercentage, minimumFeeText, targetAccountName }}
        />
    ),
};

export type TTransferMessagesKeys = keyof typeof TransferMessagesConfig;
