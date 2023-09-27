import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-card'>
            <WalletGradientBackground
                currency={account?.currency_config?.display_code || 'USD'}
                device='mobile'
                hasShine
                isDemo={account?.is_virtual}
                type='card'
            >
                <div className='wallets-card__details'>
                    <div className='wallets-card__details__top'>
                        <WalletCardIcon type={account?.wallet_currency_type} />
                        <div className='wallets-card__details-landing_company'>
                            {account?.landing_company_name && (
                                <WalletListCardBadge
                                    isDemo={account?.is_virtual}
                                    label={account?.landing_company_name}
                                />
                            )}
                        </div>
                    </div>
                    <div className={`wallets-card__details__bottom${account?.is_virtual ? '--virtual' : ''}`}>
                        <p className='wallets-card__details__bottom__currency'>{account?.currency} Wallet</p>
                        <p className='wallets-card__details__bottom__balance'>
                            {account?.display_balance} {account?.currency}
                        </p>
                    </div>
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default WalletCard;
