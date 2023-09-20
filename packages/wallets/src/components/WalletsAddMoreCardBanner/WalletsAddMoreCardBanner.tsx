import React from 'react';

type TWalletsAddMoreCardBanner = {
    is_added: boolean;
    landing_company_name: string;
};

const WalletsAddMoreCardBanner = ({ is_added, landing_company_name }: TWalletsAddMoreCardBanner) => {
    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <span className='wallets-add-more__banner-logo'>LOGO</span>
                <span className='wallets-add-more__banner-landing-company'>{landing_company_name.toUpperCase()}</span>
            </div>
            <button
                className={`wallets-add-more__banner-button ${
                    is_added ? 'wallets-add-more__banner-button--is-added' : ''
                }`}
            >
                {is_added ? '✅ Added' : '🏥 Add'}
            </button>
        </div>
    );
};

export default WalletsAddMoreCardBanner;
