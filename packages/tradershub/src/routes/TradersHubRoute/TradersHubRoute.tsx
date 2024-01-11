import React from 'react';
import { useActiveTradingAccount, useIsDIELEnabled } from '@deriv/api';
import { Heading, useBreakpoint } from '@deriv/quill-design';
import {
    CFDSection,
    ContentSwitcher,
    DemoRealSwitcher,
    OptionsAndMultipliersSection,
    RegulationSwitcherDesktop,
    RegulationSwitcherMobile,
    TotalAssets,
} from '../../components';

const TradersHubRoute = () => {
    const { isMobile } = useBreakpoint();
    const { data: isDIEL } = useIsDIELEnabled();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const isSwitcherVisible = isDIEL && !activeTradingAccount?.is_virtual;

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
                <div className='grid place-content-center pb-1200'>
                    <TotalAssets />
                </div>
                <ContentSwitcher>
                    <ContentSwitcher.HeaderList list={['Options & Multipliers', 'CFDs']} />
                    <ContentSwitcher.PanelContainer>
                        <ContentSwitcher.Panel>
                            <OptionsAndMultipliersSection />
                        </ContentSwitcher.Panel>
                        <ContentSwitcher.Panel>
                            <CFDSection />
                        </ContentSwitcher.Panel>
                    </ContentSwitcher.PanelContainer>
                </ContentSwitcher>
            </div>
        );

    return (
        <div className='flex flex-col gap-1200'>
            <div className='flex items-center justify-between align-start gap-100'>
                <div className='flex items-center gap-600'>
                    <Heading.H3 className='font-sans'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                {isSwitcherVisible && <RegulationSwitcherDesktop />}
                <TotalAssets />
            </div>
            <OptionsAndMultipliersSection />
            <CFDSection />
        </div>
    );
};

export default TradersHubRoute;
