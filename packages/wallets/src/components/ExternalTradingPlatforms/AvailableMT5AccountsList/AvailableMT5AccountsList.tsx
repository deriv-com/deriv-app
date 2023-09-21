import React from 'react';
import { useSortedMT5Accounts } from '@deriv/api';
import DerivedMT5 from '../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../public/images/mt5-swap-free.svg';
import { SecondaryActionButton } from '../../SecondaryActionButton';
import { TradingAccountCard } from '../../TradingAccountCard';
import './AvailableMT5AccountsList.scss';

const market_type_to_description_mapper = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

const market_type_to_name_mapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const market_type_to_icon_mapper = {
    all: <SwapFreeMT5 />,
    financial: <FinancialMT5 />,
    synthetic: <DerivedMT5 />,
};

type TProps = {
    account: NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-mt5__icon'>
                    {market_type_to_icon_mapper[account.market_type || 'all']}
                </div>
            )}
            trailing={() => (
                <SecondaryActionButton>
                    <p className='wallets-available-mt5__text'>Get</p>
                </SecondaryActionButton>
            )}
        >
            <div className='wallets-available-mt5__details'>
                <p className='wallets-available-mt5__details-title'>
                    {market_type_to_name_mapper[account.market_type || 'all']}
                </p>
                <p className='wallets-available-mt5__details-description'>
                    {market_type_to_description_mapper[account.market_type || 'all']}
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
