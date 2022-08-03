import { Icon, Text } from '@deriv/components';
import React from 'react';
import './empty-state.scss';

export type TEmptyStateProps = {
    icon: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
};

const EmptyState = ({ icon, title, description }: TEmptyStateProps) => (
    <div className='cashier-empty-state'>
        <Icon icon={icon} className='cashier-empty-state__icon' />
        <Text as='h2' weight='bold' align='center' className='cashier-empty-state__title'>
            {title}
        </Text>
        <Text as='p' size='xs' align='center' className='cashier-empty-state__desc'>
            {description}
        </Text>
    </div>
);

export default EmptyState;
