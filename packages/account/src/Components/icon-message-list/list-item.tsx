import React from 'react';
import { Icon, Text } from '@deriv/components';

type TListItem = {
    text?: string;
};

const ListItem = ({ text }: TListItem) => (
    <div className='account-management__list-message'>
        <div className='account-management__list-icon'>
            <Icon icon='IcCloseCircle' color='red' />
        </div>
        <div className='account-management__list-text-container'>
            <Text size='xs' className='account-management__list-text'>
                {text}
            </Text>
        </div>
    </div>
);

export default ListItem;
