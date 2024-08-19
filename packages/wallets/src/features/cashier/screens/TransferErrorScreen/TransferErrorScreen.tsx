import React from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize } from '@deriv-com/translations';
import { WalletsErrorScreen } from '../../../../components';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    resetError?: VoidFunction;
};

type TErrorContent = {
    buttonText?: React.ReactNode;
    message: React.ReactNode;
    onClick?: () => void;
    title: React.ReactNode;
};

const TransferErrorScreen: React.FC<TProps> = ({ error, resetError }) => {
    const defaultContent: TErrorContent = {
        buttonText: <Localize i18n_default_text='Make another transfer' />,
        message: error.message,
        onClick: () => {
            resetError?.();
        },
        title: <Localize i18n_default_text='Error' />,
    };

    return <WalletsErrorScreen {...defaultContent} />;
};

export default TransferErrorScreen;
