import React, { useMemo } from 'react';
import { useActiveTradingAccount, useIsDIELEnabled } from '@deriv/api';
import { Button, Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import {
    ContentSwitcher,
    DemoRealSwitcher,
    OptionsAndMultipliersSection,
    StaticLink,
    TotalAssets,
    useContentSwitch,
} from '../../components';
import { CTraderList } from '../../features/cfd/components/CTraderList';
import { OtherCFDPlatformsList } from '../../features/cfd/components/OtherCFDPlatformsList';

const TradersHubRoute = () => {
    const { isMobile } = useBreakpoint();
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: isDIEL } = useIsDIELEnabled();
    const { activeTabLabel } = useContentSwitch();

    const showRegulationSwitcher = useMemo(() => {
        if (!activeTrading?.is_virtual && isDIEL) {
            return (
                <div className='flex items-center gap-400'>
                    <Text size='sm'>Regulation:</Text>
                    <LabelPairedCircleInfoMdRegularIcon className='cursor-pointer' />
                    <ContentSwitcher.HeaderList className='w-[200px] h-2000' list={['Non-EU', 'EU']} />
                    <ContentSwitcher.PanelContainer />
                </div>
            );
        }

        return null;
    }, [activeTrading?.is_virtual, isDIEL]);

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
                <ContentSwitcher.HeaderList list={['Options & Multiplier', 'CFDs']} size='lg' />
                <ContentSwitcher.PanelContainer>
                    <ContentSwitcher.Panel label='Options & Multiplier'>
                        <OptionsAndMultipliersSection />
                    </ContentSwitcher.Panel>
                </ContentSwitcher.PanelContainer>
            </div>
        );

    return (
        <div className='flex flex-col gap-1200'>
            <div className='flex items-center justify-between align-start gap-100'>
                <div className='flex items-center gap-600'>
                    <Heading.H3 className='font-sans'>Trader&apos;s Hub</Heading.H3>
                    <DemoRealSwitcher />
                </div>
                {showRegulationSwitcher}
                <TotalAssets />
            </div>
            <OptionsAndMultipliersSection />

            <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100'>
                <div className='pb-1200'>
                    <div className='flex items-center gap-200'>
                        <Heading.H4 className='font-sans'>CFDs</Heading.H4>
                        <Button className='no-underline' colorStyle='coral' size='sm' variant='tertiary'>
                            Compare Accounts
                        </Button>
                    </div>
                    <Text size='sm'>
                        Trade with leverage and tight spreads for better returns on trades.
                        <StaticLink size='md' staticUrl='/trade-types/cfds/'>
                            Learn more
                        </StaticLink>
                    </Text>
                </div>
                <div className='space-y-1200'>
                    <div>
                        <Text bold className='pb-800' size='md'>
                            Deriv MT5
                        </Text>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                        <CTraderList />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                        <OtherCFDPlatformsList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradersHubRoute;
