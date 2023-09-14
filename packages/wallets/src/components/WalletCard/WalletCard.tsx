import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletCard.scss';

type TProps = {
    account: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    const { currency, display_balance, is_virtual, landing_company_name, wallet_currency_type } = account || {};
    return (
        <div className='wallets-card'>
            <WalletGradientBackground
                is_demo={is_virtual}
                currency={currency || 'USD'}
                type='card'
                device='mobile'
                has_shine
            >
                <div className='wallets-card__details'>
                    <div className='wallets-card__details__top'>
                        <WalletListCardIcon type={wallet_currency_type} />
                        <div className='wallets-card__details-landing_company'>
                            {landing_company_name && <WalletListCardBadge label={landing_company_name} />}
                        </div>
                    </div>
                    <div className={`wallets-card__details__bottom${is_virtual ? '--virtual' : ''}`}>
                        <p className='wallets-card__details__bottom__currency'>{currency} Wallet</p>
                        <p className='wallets-card__details__bottom__balance'>
                            {display_balance} {currency}
                        </p>
                    </div>
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default WalletCard;
