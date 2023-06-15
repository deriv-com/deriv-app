import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import AddWalletCard from './wallet-add-card';
import './add-more-wallets.scss';

const AddWallets = () => {
    return (
        <div className='add-wallets'>
            <Text as='h2' size='l' color='prominent' align='left' weight='bolder'>
                {localize('Add more Wallets')}
            </Text>
            <div className='add-wallets__wrapper'>
                <div className='add-wallets__container'>
                    <AddWalletCard />
                    <AddWalletCard />
                    <AddWalletCard />
                    <AddWalletCard />
                    <AddWalletCard />
                    <AddWalletCard />
                    <AddWalletCard />
                </div>
            </div>
        </div>
    );
};

export default AddWallets;
