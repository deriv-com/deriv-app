import React, { FC } from 'react';
import useRegulationFlags from '../../../../hooks/useRegulationFlags';
import { MarketType, MarketTypeDetails } from '../../constants';
import { MT5AccountTypeCard } from '../MT5AccountTypeCard';

type TMT5AccountTypeProps = {
    onMarketTypeSelect: (marketType: keyof typeof MarketTypeDetails) => void;
    selectedMarketType?: keyof typeof MarketTypeDetails;
};

const MT5AccountType: FC<TMT5AccountTypeProps> = ({ onMarketTypeSelect, selectedMarketType }) => {
    const { isEU } = useRegulationFlags();
    const marketTypeDetails = MarketTypeDetails(isEU);
    const sortedMarketTypeEntries = Object.entries(marketTypeDetails).sort(([keyA], [keyB]) => {
        const order = [MarketType.SYNTHETIC, MarketType.FINANCIAL, MarketType.ALL];
        return order.indexOf(keyA) - order.indexOf(keyB);
    });

    return (
        <div className='flex items-center flex-shrink-0 bg-system-light-primary-background rounded-xl h-[70vh] w-[80vw] justify-center p-1200 flex-1 gap-1200'>
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
