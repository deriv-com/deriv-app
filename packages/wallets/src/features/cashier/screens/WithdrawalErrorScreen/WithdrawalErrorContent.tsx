import { ComponentProps } from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletButton } from '../../../../components';
import { CryptoWithdrawalErrorCodes } from '../../../../constants/errorCodes';

type TWithdrawalErrorContentProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
    resetError: VoidFunction;
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const getWithdrawalErrorContent = ({ currency, error, resetError, setResendEmail }: TWithdrawalErrorContentProps) => {
    const cryptoConnectionError = error.code === CryptoWithdrawalErrorCodes.CryptoConnectionError;
    const cryptoInvalidAddress = error.code === CryptoWithdrawalErrorCodes.CryptoInvalidAddress;
    const invalidToken = error.code === CryptoWithdrawalErrorCodes.InvalidToken;
    const suspendedCurrencyWithdrawal =
        error.code === CryptoWithdrawalErrorCodes.SuspendedCurrency ||
        error.code === CryptoWithdrawalErrorCodes.SuspendedWithdrawal;

    let content: {
        buttonText?: string;
        buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
        message?: string;
        onClick?: () => void;
        showIcon?: boolean;
        title?: string;
    } = {
        buttonText: 'Try again',
        buttonVariant: 'ghost',
        message: error.message,
        onClick: () => window.location.reload(),
        showIcon: true,
        title: undefined,
    };

    if (invalidToken) {
        content = {
            buttonText: 'Resend email',
            buttonVariant: 'contained',
            message: 'The verification link you used is invalid or expired. Please request for a new one.',
            onClick: () => {
                resetError();
                setResendEmail(true);
            },
            title: 'Email verification failed',
        };
    }
    if (cryptoInvalidAddress) {
        content = {
            ...content,
            onClick: () => resetError(),
            title: 'Error',
        };
    }
    if (suspendedCurrencyWithdrawal) {
        content = {
            ...content,
            buttonText: undefined,
            message: `Due to system maintenance, withdrawals with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            showIcon: false,
            title: `${currency} Wallet withdrawals are temporarily unavailable`,
        };
    }
    if (cryptoConnectionError) {
        content = { ...content, buttonText: undefined, title: 'Maintenance in progess' };
    }
    return content;
};

export default getWithdrawalErrorContent;
