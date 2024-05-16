import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoWithdrawalErrorCodes } from '../../../../constants/errorCodes';
import getWithdrawalErrorContent from './WithdrawalErrorContent';

type TProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
    resetError: VoidFunction;
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawalErrorScreen: React.FC<TProps> = ({ currency, error, resetError, setResendEmail }) => {
    const cryptoConnectionError = error.code === CryptoWithdrawalErrorCodes.CryptoConnectionError;
    const cryptoInvalidAddress = error.code === CryptoWithdrawalErrorCodes.CryptoInvalidAddress;
    const invalidToken = error.code === CryptoWithdrawalErrorCodes.InvalidToken;
    const suspendedCurrencyWithdrawal =
        error.code === CryptoWithdrawalErrorCodes.SuspendedCurrency ||
        error.code === CryptoWithdrawalErrorCodes.SuspendedWithdrawal;

    const withdrawalErrorContent = getWithdrawalErrorContent({
        cryptoConnectionError,
        cryptoInvalidAddress,
        currency,
        error,
        invalidToken,
        resetError,
        setResendEmail,
        suspendedCurrencyWithdrawal,
    });

    return (
        <div
            className={classNames('wallets-withdrawal-error-screen', {
                'wallets-withdrawal-eror-screen__no-icon': suspendedCurrencyWithdrawal,
            })}
        >
            <WalletsErrorScreen
                buttonText={withdrawalErrorContent.buttonText}
                buttonVariant={withdrawalErrorContent.buttonVariant}
                message={withdrawalErrorContent.message}
                onClick={withdrawalErrorContent.onClick}
                showIcon={!suspendedCurrencyWithdrawal}
                title={withdrawalErrorContent.title}
            />
        </div>
    );
};

export default WithdrawalErrorScreen;
