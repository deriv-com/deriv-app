import React from 'react';
import Icon from '../icon/icon';
import Text from '../text';
import './empty-state.scss';

type TProps = {
    icon: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
};

const EmptyState = ({ icon, title, description }: TProps) => (
    <div className='components-empty-state'>
        <Icon icon={icon} className='components-empty-state__icon' />
        <Text as='h2' weight='bold' align='center' className='components-empty-state__title'>
            {title}
        </Text>
        <Text as='p' size='xs' align='center' className='components-empty-state__desc'>
            {description}
        </Text>
    </div>
);

export default EmptyState;
