import React from 'react';
import { useAvailableWallets } from '@deriv/api';
import { WalletGradientBackground } from '../WalletGradientBackground';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';
import WalletsAddMoreCardContent from '../WalletsAddMoreCardContent';

type TWalletsAddMoreCard = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[0];

const WalletsAddMoreCard = ({ currency, isAdded, landingCompanyName }: TWalletsAddMoreCard) => {
    return (
        <div className='wallets-add-more__card'>
            <WalletGradientBackground currency={currency || 'USD'} device='mobile' hasShine type='card'>
                <WalletsAddMoreCardBanner
                    currency={currency || 'USD'}
                    isAdded={isAdded}
                    landingCompanyName={landingCompanyName ?? ''}
                />
            </WalletGradientBackground>
            <WalletsAddMoreCardContent currency={currency ?? ''} />
        </div>
    );
};

export default WalletsAddMoreCard;
