import React from 'react';
import { useDynamicLeverage } from '@deriv/api';
import { qtMerge } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import { PlatformDetails } from '../../constants';
import { DynamicLeverageMarketCard } from './DynamicLeverageMarketCard';

const DynamicLeverageScreen = () => {
    const { data: dynamicLeverages } = useDynamicLeverage(PlatformDetails.mt5.platform);
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();

    if (!dynamicLeverages) return null;

    return (
        <div
            className={qtMerge(
                'flex flex-col gap-1200 mt-[15px] mx-1200 mb-1200 sm:mx-[128px] sm:mb-50 pb-5000 absolute top-50 [transform:rotateY(180deg)] transition-transform ease-in duration-[0.6s] backface-hidden',
                isDynamicLeverageVisible && '[transform:rotateY(0deg)]'
            )}
        >
            <Text>
                Enjoy dynamic leverage of <strong>up to 1:1500</strong> when trading selected instruments in the forex,
                commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to
                your trading position, based on asset type and trading volume.
            </Text>
            <div className='grid grid-cols-1 gap-1200 mx-[65px] my-50 sm:grid-cols-2 sm:mx-5000'>
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
