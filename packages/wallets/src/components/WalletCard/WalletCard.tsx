import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCard.scss';

type TProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-card' key={account.loginid}>
            <div className='wallets-card__data'>
                <div className='wallets-card__data__details'>
                    <div className='wallets-card__data__details-container'>
                        <div className='wallets-card__data__details-icon'>
                            <WalletListCardIcon type={account.wallet_currency_type} />
                        </div>
                        <div className='wallets-card__data__details-landing_company'>
                            {account?.landing_company_name && (
                                <WalletListCardBadge label={account?.landing_company_name} />
                            )}
                        </div>
                    </div>
                    <div className='wallets-card__data__details-balance'>
                        <p>{account.currency} Wallet</p>
                        <p>
                            {account.display_balance} {account.currency}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
