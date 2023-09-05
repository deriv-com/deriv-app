import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-card' key={account.loginid}>
            <div className='wallets-card__data'>
                <div className='wallets-card__data__details'>
                    <div className='wallets-card__data__details-icon'>
                        <h1>{account.currency}</h1>
                    </div>

                    <div className='wallets-card__data__details-balance'>
                        <p>{account.currency} Wallet</p>
                        <h3>
                            {account.display_balance} {account.currency}
                        </h3>
                    </div>
                    <div className='wallets-card__data__details-landing_company'>
                        {account?.landing_company_name && <WalletListCardBadge label={account?.landing_company_name} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
