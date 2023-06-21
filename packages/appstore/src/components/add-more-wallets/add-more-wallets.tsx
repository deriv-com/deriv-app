import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDisplayAvailableWallets } from '@deriv/hooks';
import CarouselContainer from './carousel-container';
import AddWalletCard from './wallet-add-card';
import './add-more-wallets.scss';

const AddWallets = () => {
    const { data } = useDisplayAvailableWallets();

    return (
        <div className='add-wallets' data-testid='dt-add-wallets'>
            <Text as='h2' size='l' color='prominent' align='left' weight='bolder' className='add-wallets__title'>
                {localize('Add more Wallets')}
            </Text>
            <CarouselContainer>
                {data?.map((wallet_info, idx) => (
                    <AddWalletCard wallet_info={wallet_info} key={idx} />
                ))}
            </CarouselContainer>
        </div>
    );
};

export default AddWallets;
