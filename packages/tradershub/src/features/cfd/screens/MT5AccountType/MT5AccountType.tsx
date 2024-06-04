import React, { useEffect } from 'react';
import { useRegulationFlags } from '@/hooks';
import { MarketTypeDetails } from '@cfd/constants';
import { MT5AccountTypeCard } from '../MT5AccountTypeCard';

type TMT5AccountTypeProps = {
    onMarketTypeSelect: (marketType?: keyof typeof MarketTypeDetails) => void;
    selectedMarketType?: keyof typeof MarketTypeDetails;
};

const MT5AccountType = ({ onMarketTypeSelect, selectedMarketType }: TMT5AccountTypeProps) => {
    const { isEU } = useRegulationFlags();
    const marketTypeDetails = MarketTypeDetails(isEU);
    const sortedMarketTypeEntries = Object.entries(marketTypeDetails).sort(([keyA], [keyB]) => {
        const order = ['synthetic', 'financial', 'all'];
        return order.indexOf(keyA) - order.indexOf(keyB);
    });

    useEffect(() => {
        return () => onMarketTypeSelect(undefined);
    }, [onMarketTypeSelect]);

    return (
        <div className='flex items-center flex-shrink-0 bg-system-light-primary-background rounded-xl h-[70vh] w-[80vw] justify-center p-24 flex-1 gap-24'>
            {sortedMarketTypeEntries.map(([key, value]) => (
                <MT5AccountTypeCard
                    description={value.description}
                    icon={value.icon}
                    isSelected={selectedMarketType === key}
                    key={key}
                    // @ts-expect-error the key always is the type of keyof typeof marketTypeDetailsMapper.
                    onClick={() => onMarketTypeSelect(key === selectedMarketType ? undefined : key)}
                    title={value.title}
                />
            ))}
        </div>
    );
};

export default MT5AccountType;
