import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Icon from '../icon';
import './status-badge.scss';

type StatusBadgeProps = {
    account_status: any;
    icon: string;
    text: ReactNode;
};

const StatusBadge = ({ account_status, icon, text, className }: StatusBadgeProps & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={classNames(
                'switcher-status-badge__container',
                className,
                `switcher-status-badge__container--${account_status || 'failed'}`
            )}
        >
            <div
                className={classNames(
                    'switcher-status-badge__container--icon',
                    `switcher-status-badge__container--icon${account_status || 'failed'}`
                )}
            >
                <Icon icon={icon} size='11' />
            </div>
            {text}
        </div>
    );
};

export default observer(StatusBadge);
