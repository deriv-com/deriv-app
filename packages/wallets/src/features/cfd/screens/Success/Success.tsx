import React, { ReactNode } from 'react';
import { useActiveWalletAccount, useSortedMT5Accounts } from '@deriv/api';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../../../../components/WalletMarketCurrencyIcon';
import { WalletText } from '../../../../components';
import './Success.scss';

type TSuccessProps = {
    description: string;
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
    renderButton: () => ReactNode;
    title: string;
};

const marketTypeToTitleMapper: Record<TSuccessProps['marketType'], string> = {
    all: 'Swap-Free',
    financial: 'MT5 Financial',
    synthetic: 'MT5 Derived',
};

const Success: React.FC<TSuccessProps> = ({ description, marketType, renderButton, title }) => {
    const { data } = useActiveWalletAccount();
    const isDemo = data?.is_virtual;
    const landingCompanyName = data?.landing_company_name?.toUpperCase();

    return (
        <div className='wallets-success'>
            <WalletGradientBackground
                bodyClassName='wallets-success__info'
                currency={data?.currency || 'USD'}
                hasShine
                theme='grey'
            >
                <div className={`wallets-success__info-badge wallets-success__info-badge--${isDemo ? 'demo' : 'real'}`}>
                    {isDemo ? 'Demo' : 'Real'}
                </div>
                <WalletMarketCurrencyIcon
                    currency={data?.currency || 'USD'}
                    isDemo={isDemo || false}
                    marketType={marketType}
                />
                <WalletText size='2xs'>
                    {marketTypeToTitleMapper[marketType]} ({landingCompanyName})
                </WalletText>
                {/* <div className='wallets-success__info__text--type'></div> */}
                <WalletText color='primary' size='2xs'>
                    {data?.currency} Wallet
                </WalletText>
                <WalletText size='sm' weight='bold'>
                    {data?.display_balance} USD
                </WalletText>
                {/* <div className='wallets-success__info__text--wallet'>{data?.currency} Wallet</div>
                <div className='wallets-success__info__text--amount'>{data?.display_balance} USD</div> */}
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
