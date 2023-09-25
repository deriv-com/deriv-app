import React from 'react';
import './WalletAccountReady.scss';
import { WalletModal } from '../WalletModal';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardIcon } from '../WalletListCardIcon';
import { useActiveWalletAccount, type useMT5AccountsList } from '@deriv/api';
import { useModal } from '../ModalProvider';

type TWalletAccountReadyProps = {
    market_type: string;
};

const market_type_to_icon_mapper = {
    all: SwapFreeMT5Icon,
    financial: FinancialMT5Icon,
    synthetic: DerivedMT5Icon,
};

const market_type_to_title_mapper = {
    financial: 'MT5 Financial',
    all: 'Swap-Free',
    synthetic: 'MT5 Derived',
};

const WalletAccountReady = ({ market_type }: TWalletAccountReadyProps) => {
    const { data } = useActiveWalletAccount();
    const { hide } = useModal();
    const is_demo = data?.is_virtual;

    const MarketTypeIcon = React.useMemo(() => market_type_to_icon_mapper[market_type], [market_type]);

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
                <div className='wallets-account-ready__info-icon'>
                    <MarketTypeIcon className='wallets-account-ready__info-icon--after' />
                    <div
                        className={`wallets-account-ready__info-icon--before wallets-account-ready__info-icon--before-${
                            is_demo ? 'demo' : 'real'
                        }`}
                    >
                        <WalletGradientBackground
                            is_demo={is_demo}
                            currency={data?.currency || 'USD'}
                            type='card'
                            has_shine
                        >
                            <WalletListCardIcon type={is_demo ? 'Demo' : data?.currency || 'USD'} />
                        </WalletGradientBackground>
                    </div>
                </div>
                <div className='wallets-account-ready__info-icon__text-type'>MT5 Swap-Free</div>
                <div className='wallets-account-ready__info-icon__text-wallet'>{data?.currency} Wallet</div>
                <div className='wallets-account-ready__info-icon__text-amount'>{data?.display_balance} USD</div>
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
