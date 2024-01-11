import React from 'react';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '../../../features/cfd/components';

const CFDContent = () => (
    <div className='space-y-800 pt-800 lg:space-y-1200 lg:pt-1200'>
        <MT5PlatformsList />
        <CTraderList />
        <OtherCFDPlatformsList />
    </div>
);

export default CFDContent;
