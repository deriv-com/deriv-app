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
    isCarouselContent?: boolean;
    isDemo?: boolean;
    landingCompanyName?: string;
};

const WalletCard: React.FC<TProps> = ({
    balance,
    currency,
    iconSize = 'lg',
    isCarouselContent = false,
    isDemo,
    landingCompanyName,
}) => {
    const { isLoading } = useBalance();

    return (
        <div className={classNames('wallets-card', { 'wallets-card__carousel-content': isCarouselContent })}>
            <div className='wallets-card__container'>
                <WalletGradientBackground
                    currency={isDemo ? 'Demo' : currency}
                    device='mobile'
                    hasShine
                    isDemo={isDemo}
                    type='card'
                >
                    <div
                        className={classNames({
                            'wallets-card__carousel-content-details': isCarouselContent,
                            'wallets-card__details': !isCarouselContent,
                        })}
                        data-testid='dt_wallet_card_details'
                    >
                        <div
                            className={classNames('wallets-card__details-top', {
                                'wallets-card__carousel-content-details-top': isCarouselContent,
                            })}
                        >
                            <WalletCardIcon size={iconSize} type={isDemo ? 'Demo' : currency} />
                            {!isCarouselContent && (
                                <div className='wallets-card__details-landing-company'>
                                    {landingCompanyName && (
                                        <WalletListCardBadge isDemo={isDemo} label={landingCompanyName} />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='wallets-card__details-bottom'>
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
        </div>
    );
};

export default WalletCard;
