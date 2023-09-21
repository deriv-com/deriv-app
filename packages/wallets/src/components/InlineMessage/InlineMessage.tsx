import React, { useMemo } from 'react';
import useDevice from '../../hooks/useDevice';
import AlertAnnounce from '../../public/images/alert-annouce.svg';
import AlertDanger from '../../public/images/alert-danger.svg';
import AlertInfo from '../../public/images/alert-info.svg';
import Warning from '../../public/images/warning.svg';
import './InlineMessage.scss';

const type_icon_mapper = {
    warning: Warning,
    information: AlertInfo,
    announcement: AlertAnnounce,
    error: AlertDanger,
};

type TProps = RequireAtLeastOne<{ children: React.ReactNode; message: React.ReactNode; title: React.ReactNode }> & {
    size?: 'lg' | 'md' | 'sm' | 'xs';
    type?: keyof typeof type_icon_mapper;
};

const InlineMessage: React.FC<TProps> = ({ type = 'warning', size = 'xs', title, message, children }) => {
    const { is_mobile } = useDevice();
    const Icon = type_icon_mapper[type];
    const icon_size = size === 'lg' && !is_mobile ? 24 : 16;

    const size_to_font_size_mapper: Record<string, string> = useMemo(
        () => ({
            xs: is_mobile ? '8px' : '10px',
            sm: is_mobile ? '10px' : '12px',
            md: is_mobile ? '12px' : '14px',
            lg: is_mobile ? '14px' : '16px',
        }),
        [is_mobile]
    );

    const font_size = size_to_font_size_mapper[size];

    return (
        <div className={`wallets-inline-message wallets-inline-message__${type} wallets-inline-message__${size} `}>
            <Icon className={`wallets-inline-message__icon__${size}`} height={icon_size} width={icon_size} />
            <span
                className={`wallets-inline-message__messages inline-message__messages__${size}`}
                style={{ fontSize: font_size }}
            >
                {title && <strong>{title}</strong>}
                {message && <span>{message}</span>}
                {children}
            </span>
        </div>
    );
};

export default InlineMessage;
