import React from 'react';
import { useAvailableWallets } from '@deriv/api';
import { WalletGradientBackground } from '../WalletGradientBackground';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';
import WalletsAddMoreCardContent from '../WalletsAddMoreCardContent';

type TWalletsAddMoreCard = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[0];

const WalletsAddMoreCard = ({ currency, is_added, landing_company_name }: TWalletsAddMoreCard) => {
    return (
        <div className='wallets-add-more__card'>
            <WalletGradientBackground currency={currency || 'USD'} device='mobile' has_shine type='card'>
                <WalletsAddMoreCardBanner
                    currency={currency || 'USD'}
                    is_added={is_added}
                    landing_company_name={landing_company_name ?? ''}
                />
            </WalletGradientBackground>
            <WalletsAddMoreCardContent currency={currency ?? ''} />
        </div>
    );
};

export default WalletsAddMoreCard;
