import React from 'react';
import {
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    IconTypes,
} from '@deriv/quill-icons';
import { MARKET_TYPE } from '../../features/cfd/constants';
import { THooks, TPlatforms } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import './WalletMarketCurrencyIcon.scss';

const mt5MarketTypeIcon: Record<string, IconTypes> = {
    all: AccountsDmt5SwfIcon,
    financial: AccountsDmt5FinancialIcon,
    synthetic: AccountsDmt5DerivedIcon,
};

const cfdPlatformIcon: Record<string, IconTypes> = {
    ctrader: AccountsDerivCtraderIcon,
    dxtrade: AccountsDerivXIcon,
};

type TWalletMarketCurrencyIconProps = {
    currency: Exclude<THooks.ActiveWalletAccount['currency'], undefined>;
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: keyof typeof mt5MarketTypeIcon;
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
            marketType === MARKET_TYPE.ALL && platform in cfdPlatformIcon
                ? cfdPlatformIcon[platform]
                : mt5MarketTypeIcon[marketType];
    } else {
        MarketTypeIcon = AccountsDerivAccountLightIcon;
    }

    return (
        <div className='wallets-market-currency-icon'>
            <div className='wallets-market-currency-icon__container'>
                <MarketTypeIcon className='wallets-market-currency-icon__market-icon' height={24} width={24} />
                <div
                    className={`wallets-market-currency-icon__before wallets-market-currency-icon__before-${
                        isDemo ? 'demo' : 'real'
                    }`}
                >
                    <div className='wallets-market-currency-icon__currency-icon'>
                        <WalletCurrencyCard currency={currency} isDemo={isDemo} size='xs' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
