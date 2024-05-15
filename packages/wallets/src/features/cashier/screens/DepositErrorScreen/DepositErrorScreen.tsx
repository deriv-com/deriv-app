import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoDepositErrorCodes } from '../../../../constants/errorCodes';
import './DepositErrorScreen.scss';

type TProps = {
    currency?: string;
    error?: TSocketError<'cashier'>['error'];
};

const DepositErrorScreen: React.FC<TProps> = ({ currency, error }) => {
    const CryptoConnectionError = error?.code === CryptoDepositErrorCodes.CryptoConnectionError;
    const SuspendedCurrencyDeposit =
        error?.code === (CryptoDepositErrorCodes.SuspendedCurrency || CryptoDepositErrorCodes.SuspendedDeposit);

    const getErrorTitle = () => {
        if (SuspendedCurrencyDeposit) return `${currency} Wallet deposits are temporarily unavailable`;
        if (CryptoConnectionError) return 'Maintenance in progess';
        return undefined;
    };

    const getErrorMessage = () => {
        if (SuspendedCurrencyDeposit)
            return `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`;
        return error?.message;
    };

    const errorTitle = error ? getErrorTitle() : undefined;
    const errorMessage = error ? getErrorMessage() : undefined;

    return (
        <div
            className={classNames('wallets-deposit-error-screen', {
                'wallets-deposit-eror-screen__no-icon': SuspendedCurrencyDeposit,
            })}
        >
            <WalletsErrorScreen
                buttonText={SuspendedCurrencyDeposit || CryptoConnectionError ? undefined : 'Try again'}
                message={errorMessage}
                onClick={() => window.location.reload()}
                showIcon={!SuspendedCurrencyDeposit}
                title={errorTitle}
            />
        </div>
    );
};

export default DepositErrorScreen;
