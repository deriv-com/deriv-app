import React from 'react';
import { Icon, Text } from '@deriv/components';
import './wallet-account.scss';

type TWalletAccount = {
    balance?: string;
    currency?: string;
    name?: string;
    icon?: string;
};

const WalletAccount = ({ balance, name, currency, icon }: TWalletAccount) => {
    return (
        <div className='wallet-account'>
            <Icon className='wallet-account__icon' icon={icon} size={24} />
            <div className='wallet-account__details'>
                <Text as='div' className='wallet-account__details-name'>
                    {name}
                </Text>
                <Text as='div' className='wallet-account__details-balance' weight='bold'>
                    {balance} {currency}
                </Text>
            </div>
        </div>
    );
};

export default WalletAccount;
