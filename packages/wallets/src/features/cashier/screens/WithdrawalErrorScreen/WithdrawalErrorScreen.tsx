import React, { ComponentProps } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletButton, WalletsErrorScreen } from '../../../../components';
import { CryptoWithdrawalErrorCodes } from '../../../../constants/errorCodes';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    resetError?: VoidFunction;
    setResendEmail?: React.Dispatch<React.SetStateAction<boolean>>;
};

type TErrorContent = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    message?: string;
    onClick?: () => void;
    title?: string;
};

type TErrorCodeHandlers = Record<string, TErrorContent>;

const WithdrawalErrorScreen: React.FC<TProps> = ({ error, resetError, setResendEmail }) => {
    const history = useHistory();
    const { data } = useActiveWalletAccount();
    const currency = data?.currency;

    const defaultContent: TErrorContent = {
        buttonText: 'Try again',
        buttonVariant: 'ghost',
        message: error.message,
        onClick: () => window.location.reload(),
    };

    const withdrawalErrorCodeHandlers: TErrorCodeHandlers = {
        [CryptoWithdrawalErrorCodes.InvalidToken]: {
            ...defaultContent,
            buttonText: 'Resend email',
            buttonVariant: 'contained',
            message: 'The verification link you used is invalid or expired. Please request for a new one.',
            onClick: () => {
                resetError?.();
                setResendEmail?.(true);
            },
            title: 'Email verification failed',
        },
        [CryptoWithdrawalErrorCodes.CryptoInvalidAddress]: {
            ...defaultContent,
            onClick: resetError,
            title: 'Error',
        },
        [CryptoWithdrawalErrorCodes.CryptoLimitAgeVerified]: {
            ...defaultContent,
            buttonText: 'Verify identity',
            buttonVariant: 'contained',
            onClick: () => {
                // @ts-expect-error the following link is not part of wallets routes config
                history.push('/account/proof-of-identity');
            },
            title: 'Error',
        },
        [CryptoWithdrawalErrorCodes.SuspendedCurrency]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, withdrawals with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            title: `${currency} Wallet withdrawals are temporarily unavailable`,
        },
        [CryptoWithdrawalErrorCodes.SuspendedWithdrawal]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, withdrawals with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            title: `${currency} Wallet withdrawals are temporarily unavailable`,
        },
        [CryptoWithdrawalErrorCodes.CryptoConnectionError]: {
            ...defaultContent,
            buttonText: undefined,
            title: 'Maintenance in progress',
        },
    };

    const content = withdrawalErrorCodeHandlers[error.code] || defaultContent;

    return <WalletsErrorScreen {...content} />;
};

export default WithdrawalErrorScreen;
