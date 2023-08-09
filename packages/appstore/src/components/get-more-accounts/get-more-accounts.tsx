import React from 'react';
import { Icon, Text } from '@deriv/components';
import classNames from 'classnames';

export interface IGetMoreAccounts {
    description: string;
    icon: string;
    title: string;
    onClick?: () => void;
    is_disabled?: boolean;
}
const GetMoreAccounts = ({ icon, description, title, onClick, is_disabled }: IGetMoreAccounts) => {
    return (
        <div
            className={classNames('get-more-accounts', {
                'get-more-accounts__disabled': is_disabled,
            })}
            onClick={() => onClick?.()}
        >
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
