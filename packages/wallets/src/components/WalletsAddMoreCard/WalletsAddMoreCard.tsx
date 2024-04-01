import React from 'react';
import { TWalletCarouselItem } from '../../types';
import { WalletGradientBackground } from '../WalletGradientBackground';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';
import WalletsAddMoreCardContent from '../WalletsAddMoreCardContent';

const WalletsAddMoreCard: React.FC<TWalletCarouselItem> = ({ currency, is_added: isAdded, is_crypto: isCrypto }) => {
    return (
        <div className='wallets-add-more__card'>
            <WalletGradientBackground currency={currency || 'USD'} device='mobile' hasShine type='card'>
                <WalletsAddMoreCardBanner currency={currency || 'USD'} is_added={isAdded} is_crypto={isCrypto} />
            </WalletGradientBackground>
            <WalletsAddMoreCardContent currency={currency ?? ''} />
        </div>
    );
};

export default WalletsAddMoreCard;
