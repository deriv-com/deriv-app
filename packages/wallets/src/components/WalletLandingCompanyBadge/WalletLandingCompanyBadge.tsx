import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletLandingCompanyBadge.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletLandingCompanyBadge: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallet-landing-company__badge'>
            <div className='wallet-landing-company__name'>
                <p>{account.landing_company_name?.toLocaleUpperCase()}</p>
            </div>
        </div>
    );
};

export default WalletLandingCompanyBadge;
