import React from 'react';
import type { THooks } from '../../types';
import { AppCardBadge } from '../AppCardBadge';
import { WalletText } from '../Base';
import type { TGenericSizes } from '../Base/types';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletsAppLinkedWithWalletIcon } from '../WalletsAppLinkedWithWalletIcon';
import './AppCard.scss';

type TProps = {
    activeWalletCurrency: THooks.ActiveWalletAccount['currency'];
    appIcon: React.ComponentProps<typeof WalletsAppLinkedWithWalletIcon>['appIcon'];
    appName?: string;
    balance?: string;
    cardSize: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    device: 'desktop' | 'mobile';
    isDemoWallet?: THooks.ActiveWalletAccount['is_virtual'];
    walletIcon: string;
    walletName?: string;
};

const AppCard: React.FC<TProps> = ({
    activeWalletCurrency,
    appIcon,
    appName,
    balance,
    cardSize = 'md',
    device = 'desktop',
    isDemoWallet = false,
    walletIcon,
    walletName,
}) => {
    return (
        <div className={`wallets-app-card wallets-app-card--border-radius--${cardSize}`}>
            <WalletGradientBackground currency='' hasShine theme='grey'>
                {cardSize !== 'sm' && (
                    <div className='wallets-app-card__badge'>
                        <AppCardBadge isDemo={isDemoWallet} />
                    </div>
                )}
                <div className={`wallets-app-card__content wallets-app-card__content--${device}--${cardSize}`}>
                    <div className='wallets-app-card__top'>
                        <WalletsAppLinkedWithWalletIcon
                            appIcon={appIcon}
                            currency={activeWalletCurrency ?? ''}
                            isDemo={isDemoWallet}
                            size='small'
                            walletIcon={walletIcon}
                        />
                    </div>
                    {cardSize !== 'sm' && (
                        <div className='wallets-app-card__bottom'>
                            <WalletText size='2xs'>{appName}</WalletText>
                            <WalletText color='less-prominent' size='2xs'>
                                {walletName}
                            </WalletText>
                            <WalletText size='sm' weight='bold'>
                                {balance}
                            </WalletText>
                        </div>
                    )}
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default AppCard;
