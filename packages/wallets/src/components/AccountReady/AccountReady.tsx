import React from 'react';
import { useActiveWalletAccount, useSortedMT5Accounts } from '@deriv/api';
import { useModal } from '../ModalProvider';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../WalletMarketCurrencyIcon';
import './AccountReady.scss';

type TAccountReadyProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
};

const market_type_to_title_mapper: Record<TAccountReadyProps['marketType'], string> = {
    financial: 'MT5 Financial',
    all: 'Swap-Free',
    synthetic: 'MT5 Derived',
};

const AccountReady: React.FC<TAccountReadyProps> = ({ marketType }) => {
    const { data } = useActiveWalletAccount();
    const { hide } = useModal();
    const isDemo = data?.is_virtual;

    return (
        <div className='wallets-account-ready'>
            <WalletGradientBackground
                bodyClassName='wallets-account-ready__info'
                currency={data?.currency || 'USD'}
                has_shine
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
                    isDemo={isDemo || true}
                    marketType={marketType}
                />
                <div className='wallets-account-ready__info__text--type'>MT5 Swap-Free</div>
                <div className='wallets-account-ready__info__text--wallet'>{data?.currency} Wallet</div>
                <div className='wallets-account-ready__info__text--amount'>{data?.display_balance} USD</div>
            </WalletGradientBackground>
            <div className='wallets-account-ready__title'>
                Your {market_type_to_title_mapper[marketType]}
                {isDemo && ' demo'} account is ready
            </div>
            <div className='wallets-account-ready__subtitle'>
                You can now start practicing trading with your {market_type_to_title_mapper[marketType]}
                {isDemo && ' demo'} account.
            </div>
            <button className='wallets-account-ready__button' onClick={hide}>
                Continue
            </button>
        </div>
    );
};

export default AccountReady;
