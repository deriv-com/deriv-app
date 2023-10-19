import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { TradingAccountCard, WalletButton } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import DerivedMT5 from '../../../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../../../public/images/mt5-swap-free.svg';
import { JurisdictionModal, MT5PasswordModal } from '../../../modals';
import { THooks } from '../../../types';
import './AvailableMT5AccountsList.scss';

const marketTypeToDescriptionMapper = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

const marketTypeToNameMapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const marketTypeToIconMapper = {
    all: <SwapFreeMT5 />,
    financial: <FinancialMT5 />,
    synthetic: <DerivedMT5 />,
};

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { setModalState, show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-mt5__icon'>
                    {marketTypeToIconMapper[account.market_type || 'all']}
                </div>
            )}
            trailing={() => (
                <WalletButton
                    color='primary-light'
                    onClick={() => {
                        setModalState({
                            marketType: account.market_type,
                        });
                        show(
                            activeWallet?.is_virtual ? (
                                <MT5PasswordModal
                                    marketType={account?.market_type || 'synthetic'}
                                    platform={account.platform}
                                />
                            ) : (
                                <JurisdictionModal />
                            )
                        );
                    }}
                    text='Get'
                />
            )}
        >
            <div className='wallets-available-mt5__details'>
                <p className='wallets-available-mt5__details-title'>
                    {marketTypeToNameMapper[account.market_type || 'all']}
                </p>
                <p className='wallets-available-mt5__details-description'>
                    {marketTypeToDescriptionMapper[account.market_type || 'all']}
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
