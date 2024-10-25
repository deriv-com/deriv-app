import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import './status-badge.scss';

type TStatusBadgeProps = {
    account_status: string | null;
    icon: string;
    text: ReactNode;
    onClick?: () => void;
};

const StatusBadge = ({
    account_status,
    icon,
    text,
    className,
    onClick,
}: TStatusBadgeProps & HTMLAttributes<HTMLDivElement>) => (
    <div
        className={classNames(
            'switcher-status-badge__container',
            className,
            `switcher-status-badge__container--${account_status ?? 'failed'}`
        )}
        onClick={onClick}
        onKeyDown={onClick}
    >
        <div
            className={classNames(
                'switcher-status-badge__container--icon',
                `switcher-status-badge__container--icon${account_status ?? 'failed'}`
            )}
        >
            <Icon icon={icon} size='11' />
        </div>
        {text}
    </div>
);

export default StatusBadge;
