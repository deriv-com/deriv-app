import React from 'react';
import { THooks } from '../../types';
import { WalletGradientBackground } from '../WalletGradientBackground';
import WalletsAddMoreCardBanner from '../WalletsAddMoreCardBanner';
import WalletsAddMoreCardContent from '../WalletsAddMoreCardContent';

type TProps = THooks.AllWalletAccounts;

const WalletsAddMoreCard: React.FC<TProps> = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
    landing_company_name: landingCompanyName,
}) => {
    return (
        <div className='wallets-add-more__card'>
            <WalletGradientBackground currency={currency || 'USD'} device='mobile' hasShine type='card'>
                <WalletsAddMoreCardBanner
                    currency={currency || 'USD'}
                    is_added={isAdded}
                    is_crypto={isCrypto}
                    landing_company_name={landingCompanyName ?? ''}
                />
            </WalletGradientBackground>
            <WalletsAddMoreCardContent currency={currency ?? ''} />
        </div>
    );
};

export default WalletsAddMoreCard;
