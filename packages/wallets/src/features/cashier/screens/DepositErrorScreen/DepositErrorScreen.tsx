import React from 'react';
import classNames from 'classnames';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletsErrorScreen } from '../../../../components';
import getDepositErrorContent from './DepositErrorContent';
import './DepositErrorScreen.scss';

type TProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
};

const DepositErrorScreen: React.FC<TProps> = ({ currency, error }) => {
    const { buttonText, message, onClick, showIcon, title } = getDepositErrorContent({
        currency,
        error,
    });

    return (
        <div
            className={classNames('wallets-deposit-error-screen', {
                'wallets-deposit-eror-screen__no-icon': !showIcon,
            })}
        >
            <WalletsErrorScreen
                buttonText={buttonText}
                message={message}
                onClick={onClick}
                showIcon={showIcon}
                title={title}
            />
        </div>
    );
};

export default DepositErrorScreen;
