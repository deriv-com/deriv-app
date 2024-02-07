import React from 'react';
import { TradingAppCardLoader, useUIContext } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '@cfd/components';
import { useIsEuRegion } from '@deriv/api';

const CFDContent = () => {
    const { isSuccess: isRegulationAccessible } = useIsEuRegion();
    const { uiState } = useUIContext();

    const activeRegulation = uiState.regulation;

    const { isEU } = useRegulationFlags(activeRegulation);

    if (!isRegulationAccessible)
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
