import React, { ReactNode } from 'react';
import ErrorCircleCrossmark from '../../../public/images/error-circle-crossmark.svg';
import InfoCircleDots from '../../../public/images/info-circle-dots.svg';
import SuccessCircleCheckmark from '../../../public/images/success-circle-checkmark.svg';
import { WalletText } from '../index';
import './WalletAlertMessage.scss';

const typeMapper = {
    error: {
        color: 'error',
        icon: ErrorCircleCrossmark,
    },
    info: {
        color: 'blue',
        icon: InfoCircleDots,
    },
    success: {
        color: 'success',
        icon: SuccessCircleCheckmark,
    },
};

type TProps = {
    children?: ReactNode;
    message: ReactNode;
    type: 'error' | 'info' | 'success';
};

const WalletAlertMessage: React.FC<TProps> = ({ children, message, type }) => {
    const Icon = typeMapper[type].icon;
    const color = typeMapper[type].color;

    return (
        <div className='wallets-alert-message' data-testid='dt_wallet-alert-message'>
            <div className='wallets-alert-message__icon-container'>
                <div className='wallets-alert-message__icon-container__line' />
                <div className='wallets-alert-message__icon-container__icon'>
                    <Icon />
                </div>
            </div>
            <div className='wallets-alert-message__message-container'>
                <WalletText color={color} size='xs'>
                    {message}
                </WalletText>
            </div>
            {children && <>{children}</>}
        </div>
    );
};

export default WalletAlertMessage;
