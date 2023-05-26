import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';

type TP2pEmptyProps = {
    className?: string;
    children: React.ReactNode;
    has_tabs?: boolean;
    icon: string;
    title: string;
};

const P2pEmpty = ({ className, children, has_tabs = false, icon, title }: TP2pEmptyProps) => {
    return (
        <div className={classNames(className, 'p2p-empty', { 'p2p-empty--no-tabs': !has_tabs })}>
            <Icon icon={icon} className='p2p-empty-icon' size={128} />
            <div className='p2p-empty-title'>
                <Text weight='bold'>{title}</Text>
            </div>
            {children}
        </div>
    );
};

export default P2pEmpty;
