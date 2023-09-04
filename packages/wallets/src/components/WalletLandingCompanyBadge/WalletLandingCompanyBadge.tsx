import React from 'react';
import './WalletLandingCompanyBadge.scss';

type TProps = {
    landing_company_name: string;
};

const WalletLandingCompanyBadge: React.FC<TProps> = ({ landing_company_name }) => {
    return (
        <div className='wallets-landing-company__badge'>
            <div className='wallets-landing-company__name'>
                <p>{landing_company_name.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default WalletLandingCompanyBadge;
