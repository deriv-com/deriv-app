import React, { ReactNode } from 'react';
import { LegacyLossIcon, LegacySettlementFillIcon, LegacyWonIcon } from '@deriv/quill-icons';
import { WalletText } from '../index';
import './WalletAlertMessage.scss';

const typeMapper = {
    error: {
        color: 'error',
        fill: '#EC3F3F',
        icon: LegacyLossIcon,
    },
    info: {
        color: 'blue',
        fill: '#377CFC',
        icon: LegacySettlementFillIcon,
    },
    success: {
        color: 'success',
        fill: '#4BB4B3',
        icon: LegacyWonIcon,
    },
} as const;

type TProps = {
    children?: ReactNode;
    message: ReactNode;
    type: 'error' | 'info' | 'success';
};

const WalletAlertMessage: React.FC<TProps> = ({ children, message, type }) => {
    const Icon = typeMapper[type].icon;
    const color = typeMapper[type].color;
    const fill = typeMapper[type].fill;

    return (
        <div className='wallets-alert-message' data-testid='dt_wallet-alert-message'>
            <div className='wallets-alert-message__icon-container'>
                <div className='wallets-alert-message__icon-container__line' />
                <Icon className='wallets-alert-message__icon-container__icon' fill={fill} iconSize='xs' />
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
