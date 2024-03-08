import React from 'react';
import classNames from 'classnames';
import { useBalance } from '@deriv/api-v2';
import { WalletText } from '../Base';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardBadge } from '../WalletListCardBadge';
import './WalletCard.scss';

type TProps = {
    balance: string;
    currency: string;
    iconSize?: React.ComponentProps<typeof WalletCardIcon>['size'];
    isActive?: boolean;
    isCarouselContent?: boolean;
    isDemo?: boolean;
    landingCompanyName?: string;
};

const WalletCard: React.FC<TProps> = ({
    balance,
    currency,
    iconSize = 'lg',
    isActive = false,
    isCarouselContent = false,
    isDemo,
    landingCompanyName,
}) => {
    const { isLoading } = useBalance();

    return (
        <div className='wallets-card'>
            <WalletGradientBackground
                currency={isDemo ? 'Demo' : currency}
                device='mobile'
                hasShine
                isDemo={isDemo}
                type='card'
            >
                <div
                    className={classNames('wallets-card__details', {
                        'wallets-card__details__carousel-content': isCarouselContent,
                        'wallets-card__details__carousel-content--active': isCarouselContent && isActive,
                    })}
                    data-testid='dt_wallet_card_details'
                >
                    <div
                        className={classNames('wallets-card__details__top', {
                            'wallets-card__details__top__carousel-content': isCarouselContent,
                        })}
                    >
                        <WalletCardIcon size={iconSize} type={isDemo ? 'Demo' : currency} />
                        {!isCarouselContent && (
                            <div className='wallets-card__details-landing_company'>
                                {landingCompanyName && (
                                    <WalletListCardBadge isDemo={isDemo} label={landingCompanyName} />
                                )}
                            </div>
                        )}
                    </div>
                    <div className='wallets-card__details__bottom'>
                        <WalletText color={isDemo ? 'white' : 'general'} size={isCarouselContent ? 'md' : '2xs'}>
                            {currency} Wallet
                        </WalletText>
                        {isLoading ? (
                            <div
                                className='wallets-skeleton wallets-card__balance-loader'
                                data-testid='dt_wallet_card_balance_loader'
                            />
                        ) : (
                            <WalletText
                                color={isDemo ? 'white' : 'general'}
                                size={isCarouselContent ? 'xl' : 'sm'}
                                weight='bold'
                            >
                                {balance}
                            </WalletText>
                        )}
                    </div>
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default WalletCard;
