import React from 'react';
import { Icon, Text } from '@deriv/components';

export interface IGetMoreAccounts {
    description: string;
    icon: string;
    title: string;
    onClick?: () => void;
}
const GetMoreAccounts = ({ icon, description, title, onClick }: IGetMoreAccounts) => {
    return (
        <div className='get-more-accounts' onClick={() => onClick?.()}>
            <div>
                <Icon icon={icon} size={32} className='get-more-accounts__icon' />
            </div>
            <div className='get-more-accounts__details'>
                <div className='get-more-accounts__details--title'>{title}</div>
                <Text className='get-more-accounts__details--description' size='xxs' line_height='m'>
                    {description}
                </Text>
            </div>
        </div>
    );
};

export default GetMoreAccounts;
