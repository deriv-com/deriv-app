import React from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    resetError?: VoidFunction;
};

type TErrorContent = {
    buttonText?: string;
    message?: string;
    onClick?: () => void;
    title?: string;
};

const TransferErrorScreen: React.FC<TProps> = ({ error, resetError }) => {
    const defaultContent: TErrorContent = {
        buttonText: 'Make another transfer',
        message: error.message,
        onClick: () => {
            resetError?.();
        },
        title: 'Error',
    };

    return <WalletsErrorScreen {...defaultContent} />;
};

export default TransferErrorScreen;
