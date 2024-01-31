import React, { useMemo } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import {
    StandaloneBullhornRegularIcon,
    StandaloneCircleExclamationRegularIcon,
    StandaloneCircleInfoRegularIcon,
    StandaloneTriangleExclamationRegularIcon,
} from '@deriv/quill-icons';
import './InlineMessage.scss';

const typeIconMapper = {
    announcement: StandaloneBullhornRegularIcon,
    error: StandaloneTriangleExclamationRegularIcon,
    information: StandaloneCircleInfoRegularIcon,
    warning: StandaloneCircleExclamationRegularIcon,
};

type TProps = RequireAtLeastOne<{ children: React.ReactNode; message: React.ReactNode; title: React.ReactNode }> & {
    size?: 'lg' | 'md' | 'sm' | 'xs';
    type?: 'announcement' | 'error' | 'information' | 'warning';
    variant?: 'contained' | 'outlined';
};

const InlineMessage: React.FC<TProps> = ({ children, message, size = 'xs', title, type = 'warning', variant }) => {
    const { isMobile } = useBreakpoint();
    const Icon = typeIconMapper[type];
    const iconSize = size === 'xs' ? 'sm' : size;

    const sizeToFontSizeMapper: Record<string, string> = useMemo(
        () => ({
            lg: isMobile ? '14px' : '16px',
            md: isMobile ? '12px' : '14px',
            sm: isMobile ? '10px' : '12px',
            xs: isMobile ? '8px' : '10px',
        }),
        [isMobile]
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
            <Icon iconSize={iconSize} />
            <span className={`wallets-inline-message__messages inline-message__messages--${size}`} style={{ fontSize }}>
                {title && <strong>{title}</strong>}
                {message && <span>{message}</span>}
                {children}
            </span>
        </div>
    );
};

export default InlineMessage;
