import React from 'react';
import { TradingAppCardLoader } from '@/components';
import { JurisdictionModal } from '@/features/cfd/modals';
import { useRegulationFlags } from '@/hooks';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from '@cfd/components';

const CFDContent = () => {
    const { isSuccess: isRegulationAccessible } = useRegulationFlags();

    const { isEU } = useRegulationFlags();

    if (!isRegulationAccessible)
        return (
            <div className='pt-16 lg:pt-24'>
                <TradingAppCardLoader />
            </div>
        );

    return (
        <div className='pt-16 space-y-16 lg:space-y-24 lg:pt-24'>
            <MT5PlatformsList />
            {!isEU && <CTraderList />}
            {!isEU && <OtherCFDPlatformsList />}
            <JurisdictionModal />
        </div>
    );
};

export default CFDContent;
