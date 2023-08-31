import React from 'react';
import { Text, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useAvailableWallets } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CarouselContainer from './carousel-container';
import AddWalletCard from './wallet-add-card';

import './add-more-wallets.scss';

const AddMoreWallets = observer(() => {
    const { data, isLoading } = useAvailableWallets();
    const { ui: is_mobile } = useStore();

    if (!data) return <Loading is_fullscreen={false} />;

    return (
        <div className='add-wallets'>
            <Text as='h2' size={is_mobile ? 'm' : 'l'} color='prominent' weight='bolder' className='add-wallets__title'>
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
