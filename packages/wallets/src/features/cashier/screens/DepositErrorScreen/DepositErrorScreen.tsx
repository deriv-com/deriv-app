import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoDepositErrorCodes } from '../../../../constants/errorCodes';
import getDepositErrorContent from './DepositErrorContent';
import './DepositErrorScreen.scss';

type TProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
};

const DepositErrorScreen: React.FC<TProps> = ({ currency, error }) => {
    const cryptoConnectionError = error.code === CryptoDepositErrorCodes.CryptoConnectionError;
    const suspendedCurrencyDeposit =
        error.code === CryptoDepositErrorCodes.SuspendedCurrency ||
        error.code === CryptoDepositErrorCodes.SuspendedDeposit;

    const depositErrorContent = getDepositErrorContent({
        cryptoConnectionError,
        currency,
        error,
        suspendedCurrencyDeposit,
    });

    return (
        <div
            className={classNames('wallets-deposit-error-screen', {
                'wallets-deposit-eror-screen__no-icon': suspendedCurrencyDeposit,
            })}
        >
            <WalletsErrorScreen
                buttonText={depositErrorContent.buttonText}
                message={depositErrorContent.message}
                onClick={() => window.location.reload()}
                showIcon={!suspendedCurrencyDeposit}
                title={depositErrorContent.title}
            />
        </div>
    );
};

export default DepositErrorScreen;
