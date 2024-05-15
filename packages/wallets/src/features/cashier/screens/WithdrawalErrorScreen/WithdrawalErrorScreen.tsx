import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoWithdrawalErrorCodes } from '../../../../constants/errorCodes';

type TProps = {
    currency?: string;
    error?: TSocketError<'cashier'>['error'];
    resetError: VoidFunction;
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawalErrorScreen: React.FC<TProps> = ({ currency, error, resetError, setResendEmail }) => {
    const SuspendedCurrencyWithdrawal =
        error?.code ===
        (CryptoWithdrawalErrorCodes.SuspendedCurrency || CryptoWithdrawalErrorCodes.SuspendedWithdrawal);
    const InvalidCryptoAddress = error?.code === CryptoWithdrawalErrorCodes.CryptoInvalidAddress;
    const InvalidToken = error?.code === CryptoWithdrawalErrorCodes.InvalidToken;

    const getErrorTitle = () => {
        if (SuspendedCurrencyWithdrawal) return `${currency} Wallet withdrawals are temporarily unavailable`;
        if (InvalidCryptoAddress) return 'Error';
        //TODO: add check for CryptoConnectionError
        return undefined;
    };

    const getErrorMessage = () => {
        if (SuspendedCurrencyWithdrawal)
            return `Due to system maintenance, withdrawals with your ${currency} Wallet are unavailable at the moment. Please try again later.`;
        return error?.message;
    };

    const errorTitle = error ? getErrorTitle() : undefined;
    const errorMessage = error ? getErrorMessage() : undefined;

    if (InvalidToken) {
        return (
            <WalletsErrorScreen
                buttonText='Resend email'
                buttonVariant='contained'
                message='The verification link you used is invalid or expired. Please request for a new one.'
                onClick={() => {
                    resetError();
                    setResendEmail(true);
                }}
                title='Email verification failed'
            />
        );
    }

    return (
        <div
            className={classNames('wallets-withdrawal-error-screen', {
                'wallets-withdrawal-eror-screen__no-icon': SuspendedCurrencyWithdrawal,
            })}
        >
            <WalletsErrorScreen
                buttonText={SuspendedCurrencyWithdrawal ? undefined : 'Try again'}
                message={errorMessage}
                onClick={resetError}
                showIcon={!SuspendedCurrencyWithdrawal}
                title={errorTitle}
            />
        </div>
    );
};

export default WithdrawalErrorScreen;
