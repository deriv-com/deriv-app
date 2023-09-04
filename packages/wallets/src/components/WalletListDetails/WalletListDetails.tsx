import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletActions from '../WalletActions/WalletActions';
import WalletCurrencyTitle from '../WalletCurrencyTitle/WalletCurrencyTitle';
import WalletLandingCompanyBadge from '../WalletLandingCompanyBadge/WalletLandingCompanyBadge';
import './WalletListDetails.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListDetails: React.FC<TProps> = ({ account }) => {
    const { currency_config, landing_company_name } = account;

    return (
        <div className='wallets-list-details__action-container'>
            <div className='wallets-list-details__elements'>
                {currency_config?.display_code && <WalletCurrencyTitle currency={currency_config?.display_code} />}
                {landing_company_name && <WalletLandingCompanyBadge landing_company_name={landing_company_name} />}
            </div>
            <WalletActions account={account} />
        </div>
    );
};

export default WalletListDetails;
