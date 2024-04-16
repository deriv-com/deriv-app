import React from 'react';
import {
    AppContainer,
    RegulationSwitcherDesktop,
    RegulationSwitcherMobile,
    TotalAssets,
    TradersHubDesktopContent,
    TradersHubHeader,
    TradersHubMobileContent,
} from '@/components';
import { useRegulationFlags } from '@/hooks';
import { useUIContext } from '@/providers';
import { useIsDIELEnabled } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';

const TradersHubRoute = () => {
    const { isDesktop } = useDevice();
    const { data: isDIEL } = useIsDIELEnabled();
    const { uiState } = useUIContext();
    const { accountType } = uiState;
    const isReal = accountType === 'real';
    const isDemo = accountType === 'demo';
    const { hasActiveDerivAccount } = useRegulationFlags();

    const isSwitcherVisible = isDIEL && isReal;
    const isTotalAssetsVisible = hasActiveDerivAccount || isDemo;

    return (
        <AppContainer className='flex p-16 lg:p-40 gap-24 align-middle flex-col'>
            <div className='flex justify-between flex-wrap items-center'>
                <TradersHubHeader />
                {isSwitcherVisible && (isDesktop ? <RegulationSwitcherDesktop /> : <RegulationSwitcherMobile />)}
                {isTotalAssetsVisible && <TotalAssets />}
            </div>
            {!isDesktop ? <TradersHubMobileContent /> : <TradersHubDesktopContent />}
        </AppContainer>
    );
};

export default TradersHubRoute;
