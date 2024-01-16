import React from 'react';
import { useIsEuRegion } from '@deriv/api';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '../../../features/cfd/components';
import { TradingAppCardLoader } from '../../Loaders';
import { useUIContext } from '../../UIProvider';

const CFDContent = () => {
    const { isEUCountry, isSuccess } = useIsEuRegion();
    const { getUIState } = useUIContext();

    const activeRegion = getUIState('region');

    const euRegion = activeRegion === 'EU' || isEUCountry;

    if (!isSuccess)
        return (
            <div className='pt-800 lg:pt-1200'>
                <TradingAppCardLoader />
            </div>
        );

    return (
        <div className='space-y-800 pt-800 lg:space-y-1200 lg:pt-1200'>
            <MT5PlatformsList />
            {!euRegion && <CTraderList />}
            {!euRegion && <OtherCFDPlatformsList />}
        </div>
    );
};

export default CFDContent;
