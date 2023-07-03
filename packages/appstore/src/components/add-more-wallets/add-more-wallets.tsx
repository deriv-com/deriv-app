import React from 'react';
import { Text, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useAvailableWallets } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import CarouselContainer from './carousel-container';
import AddWalletCard from './wallet-add-card';

import './add-more-wallets.scss';

const AddMoreWallets = observer(() => {
    const { data, isLoading } = useAvailableWallets();

    if (!data) return <Loading is_fullscreen={false} />;

    return (
        <div className='add-wallets' data-testid='dt-add-wallets'>
            <Text as='h2' size='l' color='prominent' weight='bolder' className='add-wallets__title'>
                {localize('Add more Wallets')}
            </Text>
            <CarouselContainer>
                {isLoading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    data?.map(wallet => <AddWalletCard wallet_info={wallet} key={wallet.currency} />)
                )}
            </CarouselContainer>
        </div>
    );
});

export default AddMoreWallets;
