import React from 'react';
import {
    AccountsDerivAccountLightIcon,
    AccountsDerivXIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
} from '@deriv/quill-icons';
import { THooks, TPlatforms } from '../../types';
import { WalletCurrencyIcons } from '../WalletCurrencyIcons';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletMarketCurrencyIcon.scss';

const iconProps = { className: 'wallets-market-currency-icon__after', height: 38, width: 38 };

const marketTypeToIconMapper = {
    all: <AccountsDmt5SwfIcon {...iconProps} />,
    financial: <AccountsDmt5FinancialIcon {...iconProps} />,
    synthetic: <AccountsDmt5DerivedIcon {...iconProps} />,
} as const;

const marketTypeToPlatformIconMapper = {
    ctrader: <PartnersProductDerivCtraderBrandLightLogoHorizontalIcon {...iconProps} />,
    dxtrade: <AccountsDerivXIcon {...iconProps} />,
} as const;

type TWalletMarketCurrencyIconProps = {
    currency: Exclude<THooks.ActiveWalletAccount['currency'], undefined>;
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: THooks.SortedMT5Accounts['market_type'];
    platform?: TPlatforms.All;
};

const WalletMarketCurrencyIcon: React.FC<TWalletMarketCurrencyIconProps> = ({
    currency,
    isDemo,
    marketType,
    platform,
}) => {
    let MarketTypeIcon;
    if (marketType && platform) {
        MarketTypeIcon =
            marketType === 'all' && Object.keys(marketTypeToPlatformIconMapper).includes(platform)
                ? marketTypeToPlatformIconMapper[platform as keyof typeof marketTypeToPlatformIconMapper]
                : marketTypeToIconMapper[marketType];
    } else {
        MarketTypeIcon = <AccountsDerivAccountLightIcon {...iconProps} />;
    }

    return (
        <div className='wallets-market-currency-icon'>
            {MarketTypeIcon}
            <div
                className={`wallets-market-currency-icon__before wallets-market-currency-icon__before-${
                    isDemo ? 'demo' : 'real'
                }`}
            >
                <WalletGradientBackground currency={currency} hasShine isDemo={isDemo} type='card'>
                    <WalletCurrencyIcons currency={isDemo ? 'DEMO' : currency} size='md' />
                </WalletGradientBackground>
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
