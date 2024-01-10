import React from 'react';
import { Heading, useBreakpoint } from '@deriv/quill-design';
import { ContentSwitcher, DemoRealSwitcher, OptionsAndMultipliersSection, TotalAssets } from '../../components';
import CFDPlatformsList from '../../features/cfd/CFDPlatformsList';

const TradersHubRoute = () => {
    const { isMobile } = useBreakpoint();

    if (isMobile)
        return (
            <div className='p-800'>
                <div className='pb-1200'>
                    <Heading.H3 className='pb-200'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
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
                            <CFDPlatformsList />
                        </ContentSwitcher.Panel>
                    </ContentSwitcher.PanelContainer>
                </ContentSwitcher>
            </div>
        );

    return (
        <div className='flex flex-col gap-1200'>
            <div className='flex items-center justify-between align-start gap-100'>
                <div className='flex flex-row gap-600'>
                    <Heading.H3 className='font-sans'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                <TotalAssets />
            </div>
            <OptionsAndMultipliersSection />
            <CFDPlatformsList />
        </div>
    );
};

export default TradersHubRoute;
