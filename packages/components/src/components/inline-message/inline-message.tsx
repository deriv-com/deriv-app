import React from 'react';
import { isMobile } from '@deriv/shared';
import Icon from '../icon/icon';
import Text from '../text';
import './inline-message.scss';

const type_to_icon_mapper = {
    warning: 'IcAlertWarning',
    information: 'IcAlertInfo',
    announcement: 'IcAlertAnnounce',
    error: 'IcAlertDanger',
};

const size_to_font_size_mapper = {
    xs: isMobile() ? 'xxxxs' : 'xxxs',
    sm: isMobile() ? 'xxxs' : 'xxs',
    md: isMobile() ? 'xxs' : 'xs',
    lg: isMobile() ? 'xs' : 's',
};

type TProps = {
    type?: 'warning' | 'information' | 'announcement' | 'error';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    title?: string;
    message?: string;
    children?: React.ReactNode;
} & ({ title: string } | { message: string } | { children: React.ReactNode });

const InlineMessage: React.FC<React.PropsWithChildren<TProps>> = ({
    type = 'warning',
    size = 'xs',
    title,
    message,
    children,
}) => (
    <div className={`inline-message inline-message__${type} inline-message__${size} `}>
        <Icon
            size={size === 'lg' && !isMobile() ? 24 : 16}
            icon={type_to_icon_mapper[type]}
            className={`inline-message__icon__${size}`}
        />
        {(title || message || children) && (
            <div className={`inline-message__messages-container inline-message__messages-container__${size}`}>
                {title && (
                    <Text size={'xxxs'} weight='bold'>
                        {title}
                    </Text>
                )}
                {message && <Text size={size_to_font_size_mapper[size]}>{message}</Text>}
                {children}
            </div>
        )}
    </div>
);

export default InlineMessage;
