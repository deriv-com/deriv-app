import React from 'react';
import DerivedMT5 from '../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../public/images/mt5-swap-free.svg';
import { MT5AccountTypeCard } from '../MT5AccountTypeCard';
import './MT5AccountType.scss';

const marketTypeDetailsMapper = {
    all: {
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies, and ETFs.',
        icon: <SwapFreeMT5 />,
        title: 'Swap-Free',
    },
    financial: {
        description: 'Trade CFDs on MT5 with forex, stocks and indices, commodities, cryptocurrencies, and ETFs.',
        icon: <FinancialMT5 />,
        title: 'Financial',
    },
    synthetic: {
        description: 'Trade CFDs on MT5 with derived indices that simulate real-world market movements.',
        icon: <DerivedMT5 />,
        title: 'Derived',
    },
};

const MT5AccountType: React.FC = () => {
    return (
        <div className='wallets-mt5-account-type'>
            <div className='wallets-mt5-account-type-header'>
                <div className='wallets-mt5-account-type-header-text'>Select Deriv MT5’s account type</div>
            </div>
            <div className='wallets-mt5-account-type-content'>
                {Object.entries(marketTypeDetailsMapper).map(([key, value]) => (
                    <MT5AccountTypeCard
                        description={value.description}
                        icon={value.icon}
                        key={key}
                        title={value.title}
                    />
                ))}
            </div>
            <div className='wallets-mt5-account-type-footer'>
                <div className='wallets-mt5-account-type-footer-button'>
                    <p className='wallets-mt5-account-type-footer-button-text'>Next</p>
                </div>
            </div>
        </div>
    );
};

export default MT5AccountType;
