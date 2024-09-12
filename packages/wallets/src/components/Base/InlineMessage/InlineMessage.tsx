import React, { useMemo } from 'react';
import { useDevice } from '@deriv-com/ui';
import AlertAnnounce from '../../../public/images/alert-annouce.svg';
import AlertDanger from '../../../public/images/alert-danger.svg';
import AlertInfo from '../../../public/images/alert-info.svg';
import Warning from '../../../public/images/warning.svg';
import './InlineMessage.scss';

const typeIconMapper = {
    announcement: AlertAnnounce,
    error: AlertDanger,
    information: AlertInfo,
    warning: Warning,
};

type TProps = RequireAtLeastOne<{ children: React.ReactNode; message: React.ReactNode; title: React.ReactNode }> & {
    size?: 'lg' | 'md' | 'sm' | 'xs';
    type?: keyof typeof typeIconMapper;
    variant?: 'contained' | 'outlined';
};

const InlineMessage: React.FC<TProps> = ({ children, message, size = 'xs', title, type = 'warning', variant }) => {
    const { isDesktop } = useDevice();
    const Icon = typeIconMapper[type];
    const iconSize = size === 'lg' && isDesktop ? 24 : 16;

    const sizeToFontSizeMapper: Record<string, string> = useMemo(
        () => ({
            lg: isDesktop ? '16px' : '14px',
            md: isDesktop ? '14px' : '12px',
            sm: isDesktop ? '12px' : '10px',
            xs: isDesktop ? '10px' : '8px',
        }),
        [isDesktop]
    );

    const fontSize = sizeToFontSizeMapper[size];

    return (
        <div
            className={`wallets-inline-message 
                         wallets-inline-message--${type} 
                         wallets-inline-message--${size} 
                         wallets-inline-message--${variant} 
                         `}
            data-testid={`dt_inline_message`}
        >
            <Icon
                className={`wallets-inline-message__icon--${size}`}
                data-testid='dt_inline_message_icon'
                height={iconSize}
                width={iconSize}
            />
            <span className={`wallets-inline-message__messages inline-message__messages--${size}`} style={{ fontSize }}>
                {title && <strong>{title}</strong>}
                {message && <span>{message}</span>}
                {children}
            </span>
        </div>
    );
};

export default InlineMessage;
