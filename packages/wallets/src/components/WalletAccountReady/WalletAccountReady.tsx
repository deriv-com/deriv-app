import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { useModal } from '../ModalProvider';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../WalletMarketCurrencyIcon';
import './WalletAccountReady.scss';

type TWalletAccountReadyProps = {
    market_type: string;
};

const market_type_to_title_mapper: Record<string, string> = {
    financial: 'MT5 Financial',
    all: 'Swap-Free',
    synthetic: 'MT5 Derived',
};

const WalletAccountReady = ({ market_type }: TWalletAccountReadyProps) => {
    const { data } = useActiveWalletAccount();
    const { hide } = useModal();
    const is_demo = data?.is_virtual;

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
                        is_demo ? 'demo' : 'real'
                    }`}
                >
                    {is_demo ? 'Demo' : 'Real'}
                </div>
                <WalletMarketCurrencyIcon
                    currency={data?.currency || 'USD'}
                    is_demo={is_demo || true}
                    market_type={market_type}
                    size='sm'
                />
                <div className='wallets-account-ready__info__text--type'>MT5 Swap-Free</div>
                <div className='wallets-account-ready__info__text--wallet'>{data?.currency} Wallet</div>
                <div className='wallets-account-ready__info__text--amount'>{data?.display_balance} USD</div>
            </WalletGradientBackground>
            <div className='wallets-account-ready__title'>
                Your {market_type_to_title_mapper[market_type]}
                {is_demo && ' demo'} account is ready
            </div>
            <div className='wallets-account-ready__subtitle'>
                You can now start practicing trading with your {market_type_to_title_mapper[market_type]}
                {is_demo && ' demo'} account.
            </div>
            <button className='wallets-account-ready__button' onClick={hide}>
                Continue
            </button>
        </div>
    );
};

export default WalletAccountReady;
