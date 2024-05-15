import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import './DepositErrorScreen.scss';

type TProps = {
    currency?: string;
    error?: TSocketError<'cashier'>['error'];
};

const DepositErrorScreen: React.FC<TProps> = ({ currency, error }) => {
    const CryptoSuspendedCurrency = error?.code === 'CryptoSuspendedCurrency';

    const getErrorTitle = () => {
        if (CryptoSuspendedCurrency) return `${currency} Wallet deposits are temporarily unavailable`;
        //TODO: add check for CryptoConnectionError
        return undefined;
    };

    const getErrorMessage = () => {
        if (CryptoSuspendedCurrency)
            return `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`;
        return error?.message;
    };

    const errorTitle = error ? getErrorTitle() : undefined;
    const errorMessage = error ? getErrorMessage() : undefined;

    return (
        <div
            className={classNames('wallets-deposit-error-screen', {
                'wallets-deposit-eror-screen__no-icon': CryptoSuspendedCurrency,
            })}
        >
            <WalletsErrorScreen
                buttonText={CryptoSuspendedCurrency ? undefined : 'Try again'}
                message={errorMessage}
                onClick={() => window.location.reload()}
                showIcon={!CryptoSuspendedCurrency}
                title={errorTitle}
            />
        </div>
    );
};

export default DepositErrorScreen;
