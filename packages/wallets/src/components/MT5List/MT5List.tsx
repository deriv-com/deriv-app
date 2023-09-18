import React from 'react';
import DerivedMT5 from '../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../public/images/mt5-swap-free.svg';
import { SecondaryActionButton } from '../SecondaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './MT5List.scss';

const mt5_mapper = [
    {
        title: 'Derived',
        description: 'This account offers CFDs on derived instruments.',
        icon: <DerivedMT5 />,
    },
    {
        title: 'Financial',
        description: 'This account offers CFDs on financial instruments.',
        icon: <FinancialMT5 />,
    },
    {
        title: 'Swap-Free',
        description:
            'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
        icon: <SwapFreeMT5 />,
    },
];

const MT5List: React.FC = () => {
    return (
        <>
            <section className='wallets-mt5-list'>
                <div className='wallets-mt5-list__title'>
                    <h1>Deriv MT5</h1>
                </div>
            </section>
            <div className='wallets-mt5-list__content'>
                {mt5_mapper.map(account => (
                    <TradingAccountCard
                        {...account}
                        key={`mt5-platform-list--${account.title}`}
                        renderActions={() => (
                            <SecondaryActionButton>
                                <p className='wallets-other-cfd__text'>Get</p>
                            </SecondaryActionButton>
                        )}
                    />
                ))}
            </div>
        </>
    );
};

export default MT5List;
