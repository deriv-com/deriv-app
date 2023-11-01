import React, { ReactNode } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletText } from '../../../../components';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../../../../components/WalletMarketCurrencyIcon';
import useDevice from '../../../../hooks/useDevice';
import { TDisplayBalance, TMarketTypes, TPlatforms } from '../../../../types';
import { MarketTypeToTitleMapper, PlatformToTitleMapper } from '../../constants';
import './Success.scss';

type TSuccessProps = {
    description: string;
    displayBalance:
        | TDisplayBalance.CtraderAccountsList
        | TDisplayBalance.DxtradeAccountsList
        | TDisplayBalance.MT5AccountsList;
    marketType?: TMarketTypes.SortedMT5Accounts;
    platform?: TPlatforms.All;
    renderButton: () => ReactNode;
    title: string;
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
    const { isDesktop } = useDevice();
    const isDemo = data?.is_virtual;
    const landingCompanyName = data?.landing_company_name?.toUpperCase();

    const isMarketTypeAll = marketType === 'all';

    let marketTypeTitle = 'Deriv Apps';

    if (marketType && platform) {
        const isPlatformValid = Object.keys(PlatformToTitleMapper).includes(platform);
        if (isMarketTypeAll && isPlatformValid) {
            marketTypeTitle = PlatformToTitleMapper[platform];
        } else {
            marketTypeTitle = MarketTypeToTitleMapper[marketType];
        }
    }

    const platformTitlePrefix = platform === 'mt5' ? PlatformToTitleMapper.mt5 : '';

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
                <WalletText size='2xs'>
                    {platformTitlePrefix} {marketTypeTitle} {!isDemo && `(${landingCompanyName})`}
                </WalletText>
                <WalletText color='primary' size='2xs'>
                    {data?.currency} Wallet
                </WalletText>
                <WalletText size='sm' weight='bold'>
                    {displayBalance}
                </WalletText>
            </WalletGradientBackground>
            <WalletText align='center' size='md' weight='bold'>
                {title}
            </WalletText>
            <WalletText align='center' size='sm'>
                {description}
            </WalletText>
            {isDesktop && renderButton()}
        </div>
    );
};

export default Success;
