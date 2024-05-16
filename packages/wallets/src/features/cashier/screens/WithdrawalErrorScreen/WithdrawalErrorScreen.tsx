import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import getWithdrawalErrorContent from './WithdrawalErrorContent';

type TProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
    resetError: VoidFunction;
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawalErrorScreen: React.FC<TProps> = ({ currency, error, resetError, setResendEmail }) => {
    const { buttonText, buttonVariant, message, onClick, showIcon, title } = getWithdrawalErrorContent({
        currency,
        error,
        resetError,
        setResendEmail,
    });

    return (
        <div
            className={classNames('wallets-withdrawal-error-screen', {
                'wallets-withdrawal-eror-screen__no-icon': !showIcon,
            })}
        >
            <WalletsErrorScreen
                buttonText={buttonText}
                buttonVariant={buttonVariant}
                message={message}
                onClick={onClick}
                showIcon={showIcon}
                title={title}
            />
        </div>
    );
};

export default WithdrawalErrorScreen;
