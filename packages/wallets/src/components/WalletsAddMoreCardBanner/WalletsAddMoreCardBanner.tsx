import React from 'react';
import CheckIcon from '../../public/images/check.svg';
import PlusIcon from '../../public/images/plus.svg';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import WalletAddMoreCurrencyIcon from '../WalletAddMoreCurrencyIcon';

type TProps = THooks.AvailableWallets;

const WalletsAddMoreCardBanner: React.FC<TProps> = ({
    currency,
    is_added: isAdded,
    landing_company_name: landingCompanyName,
}) => {
    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>
                    <WalletAddMoreCurrencyIcon currency={currency ? currency.toLowerCase() : ''} />
                </span>
                <div className='wallets-add-more__banner-landing-company'>
                    <WalletText align='right' size='xs' weight='bold'>
                        {landingCompanyName}
                    </WalletText>
                </div>
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
