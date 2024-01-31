import React from 'react';
import { useIsDIELEnabled } from '@deriv/api';
import { Heading, useBreakpoint } from '@deriv/quill-design';
import { Tab, Tabs } from '@deriv-com/ui';
import {
    CFDSection,
    DemoRealSwitcher,
    OptionsAndMultipliersSection,
    RegulationSwitcherDesktop,
    RegulationSwitcherMobile,
    TotalAssets,
    TradersHubContent,
    useUIContext,
} from '../../components';
import useRegulationFlags from '../../hooks/useRegulationFlags';

const TradersHubRoute = () => {
    const { isMobile } = useBreakpoint();
    const { data: isDIEL } = useIsDIELEnabled();
    const { getUIState } = useUIContext();
    const accountType = getUIState('accountType');
    const regulation = getUIState('regulation');
    const isReal = accountType === 'real';
    const isDemo = accountType === 'demo';
    const { hasActiveDerivAccount } = useRegulationFlags(regulation, accountType);

    const isSwitcherVisible = isDIEL && isReal;
    const isTotalAssetsVisible = hasActiveDerivAccount || isDemo;

    if (isMobile)
        return (
            <div className='p-800'>
                <div className='flex items-end justify-between pb-1200'>
                    <div>
                        <Heading.H3 className='pb-200'>Trader&apos;s Hub</Heading.H3>
                        <DemoRealSwitcher />
                    </div>
                    {isSwitcherVisible && <RegulationSwitcherMobile />}
                </div>
                <div />
                <div className='grid place-content-center pb-1200'>{isTotalAssetsVisible && <TotalAssets />}</div>
                <Tabs className='w-full rounded-300 p-200'>
                    <Tab className='rounded-200 py-300 px-400' title='Options & Multipliers'>
                        <OptionsAndMultipliersSection />
                    </Tab>
                    <Tab className='rounded-200 py-300 px-400' title='CFDs'>
                        <CFDSection />
                    </Tab>
                </Tabs>
            </div>
        );

    return (
        <div className='space-y-1200'>
            <div className='grid justify-between grid-cols-3 align-start gap-100'>
                <div className='flex items-center gap-600'>
                    <Heading.H3 className='font-sans'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                <div>{isSwitcherVisible && <RegulationSwitcherDesktop />}</div>
                {isTotalAssetsVisible && <TotalAssets />}
            </div>
            <TradersHubContent />
        </div>
    );
};

export default TradersHubRoute;
