import React from 'react';
import { Text, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useAvailableWallets } from '@deriv/hooks';
import CarouselContainer from './carousel-container';
import AddWalletCard from './wallet-add-card';

import './add-more-wallets.scss';

const AddMoreWallets = () => {
    const { data, isLoading } = useAvailableWallets();

    return (
        <div className='add-wallets' data-testid='dt-add-wallets'>
            <Text as='h2' size='l' color='prominent' weight='bolder' className='add-wallets__title'>
                {localize('Add more Wallets')}
            </Text>
            <CarouselContainer>
                {isLoading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    data && data.map((info, idx: number) => <AddWalletCard wallet_info={info} key={idx} />)
                )}
            </CarouselContainer>
        </div>
    );
};

export default AddMoreWallets;
