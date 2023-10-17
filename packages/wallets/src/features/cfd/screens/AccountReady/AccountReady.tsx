import React from 'react';
import { useActiveWalletAccount, useSortedMT5Accounts } from '@deriv/api';
import { useModal } from '../../../../components/ModalProvider';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../../../../components/WalletMarketCurrencyIcon';
import './AccountReady.scss';

type TAccountReadyProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
};

const marketTypeToTitleMapper: Record<TAccountReadyProps['marketType'], string> = {
    all: 'Swap-Free',
    financial: 'MT5 Financial',
    synthetic: 'MT5 Derived',
};

const AccountReady: React.FC<TAccountReadyProps> = ({ marketType }) => {
    const { data } = useActiveWalletAccount();
    const { hide } = useModal();
    const isDemo = data?.is_virtual;
    const landingCompanyName = data?.landing_company_name?.toUpperCase();

    return (
        <div className='wallets-account-ready'>
            <WalletGradientBackground
                bodyClassName='wallets-account-ready__info'
                currency={data?.currency || 'USD'}
                hasShine
                theme='grey'
            >
                <div
                    className={`wallets-account-ready__info-badge wallets-account-ready__info-badge--${
                        isDemo ? 'demo' : 'real'
                    }`}
                >
                    {isDemo ? 'Demo' : 'Real'}
                </div>
                <WalletMarketCurrencyIcon
                    currency={data?.currency || 'USD'}
                    isDemo={isDemo || false}
                    marketType={marketType}
                />
                <div className='wallets-account-ready__info__text--type'>
                    {marketTypeToTitleMapper[marketType]} ({landingCompanyName})
                </div>
                <div className='wallets-account-ready__info__text--wallet'>{data?.currency} Wallet</div>
                <div className='wallets-account-ready__info__text--amount'>{data?.display_balance} USD</div>
            </WalletGradientBackground>
            <div className='wallets-account-ready__title'>
                Your {marketTypeToTitleMapper[marketType]}
                {isDemo && ' demo'} account is ready
            </div>
            <div className='wallets-account-ready__subtitle'>
                You can now start practicing trading with your {marketTypeToTitleMapper[marketType]}
                {isDemo && ' demo'} account.
            </div>
            <button className='wallets-account-ready__button' onClick={hide}>
                Continue
            </button>
        </div>
    );
};

export default AccountReady;
