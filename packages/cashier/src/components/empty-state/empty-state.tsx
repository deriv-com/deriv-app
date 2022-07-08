import { Icon, Text } from '@deriv/components';
import React from 'react';
import './empty-state.scss';

type TProps = {
    icon: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
};

const EmptyState: React.FC<TProps> = ({ icon, title, description }) => (
    <div className='empty-state'>
        <Icon icon={icon} className='empty-state__icon' />
        <Text as='h2' weight='bold' align='center' className='empty-state__title'>
            {title}
        </Text>
        <Text as='p' size='xs' align='center' className='empty-state__desc'>
            {description}
        </Text>
    </div>
);

export default EmptyState;
