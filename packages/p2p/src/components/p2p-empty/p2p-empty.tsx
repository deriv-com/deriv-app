import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';

type TP2pEmptyProps = {
    className?: string;
    children: React.ReactNode;
    has_tabs?: boolean;
    icon: string;
    is_disabled?: boolean;
    title: React.ReactNode;
};

const P2pEmpty = ({ className, children, has_tabs = false, is_disabled = false, icon, title }: TP2pEmptyProps) => {
    const is_disabled_color = is_disabled ? 'disabled' : '';

    return (
        <div className={classNames(className, 'p2p-empty', { 'p2p-empty--no-tabs': !has_tabs })}>
            <Icon icon={icon} className='p2p-empty-icon' color={is_disabled_color} size={128} />
            <div className='p2p-empty-title'>{title}</div>
            {children}
        </div>
    );
};

export default P2pEmpty;
