import React, { useEffect } from 'react';
import DerivedMT5 from '../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../public/images/mt5-swap-free.svg';
import { MT5AccountTypeCard } from '../MT5AccountTypeCard';
import './MT5AccountType.scss';
import { useModal } from '../../ModalProvider';

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

type TProps = {
    selectedMarketType?: keyof typeof marketTypeDetailsMapper;
};

const MT5AccountType: React.FC<TProps> = ({ selectedMarketType }) => {
    const { setModalState, modalState } = useModal();

    useEffect(() => {
        setModalState({
            marketType: selectedMarketType,
        });
    }, []);

    useEffect(() => {
        console.log(modalState?.marketType);
    });

    return (
        <div className='wallets-mt5-account-type-content'>
            {Object.entries(marketTypeDetailsMapper).map(([key, value]) => (
                <MT5AccountTypeCard
                    description={value.description}
                    icon={value.icon}
                    isSelected={modalState?.marketType === key}
                    key={key}
                    // @ts-expect-error the key always is the type of keyof typeof marketTypeDetailsMapper.
                    onClick={() => {
                        console.log('setting market type', key);
                        setModalState({
                            marketType: key,
                        });
                    }}
                    title={value.title}
                />
            ))}
        </div>
    );
};

export default MT5AccountType;
