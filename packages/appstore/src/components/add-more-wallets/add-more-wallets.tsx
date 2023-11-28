import React from 'react';
import { Text, Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useAvailableWallets } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CarouselContainer from './carousel-container';
import AddWalletCard from './wallet-add-card';

import './add-more-wallets.scss';

const AddMoreWallets = observer(() => {
    const { data, isLoading } = useAvailableWallets();
    const {
        ui: { is_mobile },
    } = useStore();

    return (
        <div className='add-wallets'>
            <Text as='h2' size={is_mobile ? 'm' : 'l'} color='prominent' weight='bolder' className='add-wallets__title'>
                <Localize i18n_default_text='Add more Wallets' />
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
