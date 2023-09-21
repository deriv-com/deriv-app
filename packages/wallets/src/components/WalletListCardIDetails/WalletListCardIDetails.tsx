import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletListCardActions from '../WalletListCardActions/WalletListCardActions';
import WalletListCardBadge from '../WalletListCardBadge/WalletListCardBadge';
import WalletListCardTitle from '../WalletListCardTitle/WalletListCardTitle';
import './WalletListCardIDetails.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCardIDetails: React.FC<TProps> = ({ account }) => {
    const { currency_config, landing_company_name, is_virtual } = account;

    return (
        <div className='wallets-list-details__action-container'>
            <div className='wallets-list-details__elements'>
                {currency_config?.display_code && <WalletListCardTitle currency={currency_config?.display_code} />}
                {landing_company_name && !is_virtual && (
                    <WalletListCardBadge label={landing_company_name.toUpperCase()} />
                )}
            </div>
            <WalletListCardActions account={account} />
        </div>
    );
};

export default WalletListCardIDetails;
