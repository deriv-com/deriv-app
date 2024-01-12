import React from 'react';
import { useIsEuRegion } from '@deriv/api';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '../../../features/cfd/components';

const CFDContent = () => {
    const { isEU } = useIsEuRegion();
    return (
        <div className='space-y-800 pt-800 lg:space-y-1200 lg:pt-1200'>
            <MT5PlatformsList />
            {!isEU && <CTraderList />}
            {!isEU && <OtherCFDPlatformsList />}
        </div>
    );
};

export default CFDContent;
