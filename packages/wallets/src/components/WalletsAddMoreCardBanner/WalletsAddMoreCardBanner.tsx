import React from 'react';
import type { useAvailableWallets } from '@deriv/api';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';

type TWalletsAddMoreCardBannerProps = NonNullable<ReturnType<typeof useAvailableWallets>['data']>[0];

const WalletsAddMoreCardBanner = ({
    currency,
    is_added: isAdded,
    landing_company_name: landingCompanyName,
}: TWalletsAddMoreCardBannerProps) => {
    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <span className='wallets-add-more__banner-landing-company'>
                    {landingCompanyName ? landingCompanyName.toUpperCase() : ''}
                </span>
            </div>
            <button
                className={`wallets-add-more__banner-button ${
                    isAdded ? 'wallets-add-more__banner-button--is-added' : ''
                }`}
            >
                {isAdded ? (
                    <CheckIcon className='wallets-add-more__banner-button-icon' />
                ) : (
                    <PlusIcon className='wallets-add-more__banner-button-icon' />
                )}
                {isAdded ? 'Added' : 'Add'}
            </button>
        </div>
    );
};

export default WalletsAddMoreCardBanner;
