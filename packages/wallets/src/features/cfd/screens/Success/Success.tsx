import React, { ReactNode } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../../../../components';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../../../../components/WalletMarketCurrencyIcon';
import './Success.scss';
import { TDisplayBalance, TMarketTypes, TPlatforms } from '../../types';

type TSuccessProps = {
    description: string;
    displayBalance: TDisplayBalance;
    marketType: TMarketTypes.SortedMT5Accounts;
    platform: TPlatforms.All;
    renderButton: () => ReactNode;
    title: string;
};

const marketTypeToTitleMapper: Record<TSuccessProps['marketType'], string> = {
    all: 'Swap-Free',
    financial: 'MT5 Financial',
    synthetic: 'MT5 Derived',
};

const marketTypeToPlatformMapper: Record<string, string> = {
    ctrader: 'cTrader',
    dxtrade: 'Deriv X',
};

const Success: React.FC<TSuccessProps> = ({
    description,
    displayBalance,
    marketType,
    platform,
    renderButton,
    title,
}) => {
    const { data } = useActiveWalletAccount();
    const isDemo = data?.is_virtual;
    const landingCompanyName = data?.landing_company_name?.toUpperCase();

    const marketTypeTitle =
        marketType === 'all' && Object.keys(marketTypeToPlatformMapper).includes(platform)
            ? marketTypeToPlatformMapper[platform]
            : marketTypeToTitleMapper[marketType];

    return (
        <div className='wallets-success'>
            <WalletGradientBackground
                bodyClassName='wallets-success__info'
                currency={data?.currency || 'USD'}
                hasShine
                theme='grey'
            >
                <div className={`wallets-success__info-badge wallets-success__info-badge--${isDemo ? 'demo' : 'real'}`}>
                    <WalletText color='white' size='2xs' weight='bold'>
                        {isDemo ? 'Demo' : 'Real'}
                    </WalletText>
                </div>
                <WalletMarketCurrencyIcon
                    currency={data?.currency || 'USD'}
                    isDemo={isDemo || false}
                    marketType={marketType}
                    platform={platform}
                />
                <WalletText lineHeight='3xs' size='2xs'>
                    {marketTypeTitle} {!isDemo && `(${landingCompanyName})`}
                </WalletText>
                <WalletText color='primary' lineHeight='sm' size='2xs'>
                    {data?.currency} Wallet
                </WalletText>
                <WalletText lineHeight='xs' size='sm' weight='bold'>
                    {displayBalance}
                </WalletText>
            </WalletGradientBackground>
            <WalletText align='center' size='md' weight='bold'>
                {title}
            </WalletText>
            <WalletText align='center' size='sm'>
                {description}
            </WalletText>
            {renderButton()}
        </div>
    );
};

export default Success;
