import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCard.scss';

type TProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    const { wallet_currency_type, landing_company_name, currency, display_balance } = account || {};

    const formattedLandingCompany =
        landing_company_name === 'virtual' ? 'Demo' : landing_company_name?.toUpperCase() || 'SVG';

    return (
        <div className='wallets-card' key={account.loginid}>
            <div className='wallets-card__data'>
                <div className='wallets-card__data__details'>
                    <div className='wallets-card__data__details-container'>
                        <WalletListCardIcon type={wallet_currency_type} />
                        <div className='wallets-card__data__details-landing_company'>
                            {landing_company_name && (
                                <WalletListCardBadge label={formattedLandingCompany} is_demo={account?.is_virtual} />
                            )}
                        </div>
                    </div>
                    <div className='wallets-card__data__details-balance'>
                        <p>{currency} Wallet</p>
                        <p>
                            {display_balance} {currency}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
