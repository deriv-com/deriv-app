import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoDepositErrorCodes } from '../../../../constants/errorCodes';

type TProps = {
    error: TSocketError<'cashier'>['error'];
};

type TErrorContent = {
    buttonText?: string;
    message?: string;
    onClick?: () => void;
    title?: string;
};

type TErrorCodeHandlers = Record<string, TErrorContent>;

const DepositErrorScreen: React.FC<TProps> = ({ error }) => {
    const { data } = useActiveWalletAccount();
    const currency = data?.currency;

    const defaultContent: TErrorContent = {
        buttonText: 'Try again',
        message: error.message,
        onClick: () => window.location.reload(),
        title: undefined,
    };

    const depositErrorCodeHandlers: TErrorCodeHandlers = {
        [CryptoDepositErrorCodes.CryptoConnectionError]: {
            ...defaultContent,
            buttonText: undefined,
            title: 'Maintenance in progess',
        },
        [CryptoDepositErrorCodes.SuspendedCurrency]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        },
        [CryptoDepositErrorCodes.SuspendedDeposit]: {
            ...defaultContent,
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        },
    };

    const content = depositErrorCodeHandlers[error.code] || defaultContent;

    return <WalletsErrorScreen {...content} />;
};

export default DepositErrorScreen;
