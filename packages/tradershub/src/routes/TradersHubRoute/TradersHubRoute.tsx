import React, { FC } from 'react';
import { Button, Heading, Text } from '@deriv/quill-design';
import { OptionsAndMultipliersSection, StaticLink } from '../../components';
import { CTraderList } from '../../features/cfd/components/CTraderList';
import { OtherCFDPlatformsList } from '../../features/cfd/components/OtherCFDPlatformsList';

const TradersHubRoute: FC = () => {
    return (
        <div className='flex flex-col gap-1200'>
            <div className='flex items-center justify-between align-start gap-100'>
                <Heading.H3>Trader&apos;s Hub</Heading.H3>
                <div className='flex flex-col items-end justify-end'>
                    <Text size='sm'>Total assets</Text>
                    <Heading.H3 className='text-status-light-information'>10,000.00 USD</Heading.H3>
                </div>
            </div>
            <OptionsAndMultipliersSection />

            <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100'>
                <div className='pb-1200'>
                    <div className='flex items-center gap-200'>
                        <Heading.H4>CFDs</Heading.H4>
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
                <div className='flex flex-col gap-y-1200'>
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
