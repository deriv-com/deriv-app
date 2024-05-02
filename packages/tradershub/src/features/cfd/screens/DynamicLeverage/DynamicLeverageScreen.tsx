import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useDynamicLeverageModalState } from '@cfd/components';
import { PlatformDetails } from '@cfd/constants';
import { useDynamicLeverage } from '@deriv/api-v2';
import { Text } from '@deriv-com/ui';
import { DynamicLeverageMarketCard } from './DynamicLeverageMarketCard';

const DynamicLeverageScreen = () => {
    const { data: dynamicLeverages } = useDynamicLeverage(PlatformDetails.mt5.platform);
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();

    if (!dynamicLeverages) return null;

    return (
        <div
            className={twMerge(
                'flex flex-col gap-24 mt-16 mx-24 pb-24 lg:mb-0 absolute top-0 lg:p-0 [transform:rotateY(180deg)] transition-transform ease-in duration-[0.6s] backface-hidden bg-system-light-primary-background',
                isDynamicLeverageVisible && '[transform:rotateY(0deg)]'
            )}
        >
            <Text align='center'>
                Enjoy dynamic leverage of <strong>up to 1:1500</strong> when trading selected instruments in the forex,
                commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to
                your trading position, based on asset type and trading volume.
            </Text>
            <div className='grid grid-cols-1 gap-24 lg:mx-[65px] mt-25 lg:grid-cols-2 '>
                {(['forex', 'metals', 'cryptocurrencies', 'stock_indices'] as const).map(key => {
                    const {
                        display_name: displayName,
                        instruments,
                        max,
                        min,
                        volume: { data },
                    } = dynamicLeverages[key];
                    return (
                        <DynamicLeverageMarketCard
                            data={data}
                            displayName={displayName}
                            instruments={instruments}
                            key={`dynamic-leverage-screen__${key}`}
                            max={max}
                            min={min}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default DynamicLeverageScreen;
