import React from 'react';
import { useIsEuRegion } from '@deriv/api';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '../../../features/cfd/components';
import useRegionFlags from '../../../hooks/useRegionFlags';
import { TradingAppCardLoader } from '../../Loaders';
import { useUIContext } from '../../UIProvider';

const CFDContent = () => {
    const { isSuccess } = useIsEuRegion();
    const { getUIState } = useUIContext();

    const activeRegion = getUIState('region');

    const { isEU } = useRegionFlags(activeRegion);

    if (!isSuccess)
        return (
            <div className='pt-800 lg:pt-1200'>
                <TradingAppCardLoader />
            </div>
        );

    return (
        <div className='space-y-800 pt-800 lg:space-y-1200 lg:pt-1200'>
            <MT5PlatformsList />
            {!isEU && <CTraderList />}
            {!isEU && <OtherCFDPlatformsList />}
        </div>
    );
};

export default CFDContent;
