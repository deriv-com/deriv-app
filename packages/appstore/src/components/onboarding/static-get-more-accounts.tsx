import React from 'react';
import { Icon, Text } from '@deriv/components';

import './static-get-more-accounts.scss';

export interface IGetMoreAccounts {
    description: string;
    icon: string;
    title: string;
}

const StaticGetMoreAccounts = ({ icon, description, title }: IGetMoreAccounts) => {
    return (
        <div className='static-get-more-accounts'>
            <div>
                <Icon icon={icon} size={32} className='static-get-more-accounts__icon' />
            </div>
            <div className='static-get-more-accounts__details'>
                <div className='static-get-more-accounts__details--title'>{title}</div>
                <Text className='static-get-more-accounts__details--description' size='xxs' line_height='m'>
                    {description}
                </Text>
            </div>
        </div>
    );
};

export default StaticGetMoreAccounts;
