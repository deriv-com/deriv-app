import React from 'react';
import { useBalance } from '@deriv/api';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletCard.scss';

type TProps = {
    account: THooks.WalletAccountsList;
};

const WalletCard: React.FC<TProps> = ({ account }) => {
    const { isLoading } = useBalance();
    return (
        <div className='wallets-card'>
            <WalletGradientBackground
                currency={account?.wallet_currency_type || 'USD'}
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
                    <div className='wallets-card__details__bottom'>
                        <WalletText color={account?.is_virtual ? 'white' : 'black'} size='2xs'>
                            {account?.currency} Wallet
                        </WalletText>
                        {isLoading ? (
                            <div className='wallets-skeleton wallets-card--balance-loader' />
                        ) : (
                            <WalletText color={account?.is_virtual ? 'white' : 'black'} size='sm' weight='bold'>
                                {account?.display_balance}
                            </WalletText>
                        )}
                    </div>
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default WalletCard;
