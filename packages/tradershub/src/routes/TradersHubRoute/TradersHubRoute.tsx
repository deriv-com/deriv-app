import React from 'react';
import { Button, Heading, Text } from '@deriv/quill-design';

const TradersHubRoute: React.FC = () => (
    <div className='max-w-[1200px] mx-auto pt-2000 px-400'>
        <div className='flex flex-col gap-1200'>
            {/* Header */}
            <div className='flex align-start items-center justify-between gap-100'>
                <Heading.H3>Trader&apos;s Hub</Heading.H3>
                <div className='flex flex-col items-end justify-end'>
                    <Text size='sm'>Total Assets</Text>
                    <Heading.H3 className='text-status-light-information'>10,000.00 USD</Heading.H3>
                </div>
            </div>
            {/* Deriv Apps */}
            <div className='p-1200 rounded-1200 border-xs border-solid border-opacity-black-100'>
                <div className='pb-1200 lg:w-4/6'>
                    <Heading.H4>Options & multipliers</Heading.H4>
                    <Text size='sm'>
                        Earn a range of payouts by correctly predicting market price movements with{' '}
                        <a className='text-solid-coral-700 underline underline-offset-2 cursor-pointer'>options</a> or
                        get the upside of CFDs without risking more than your initial stake with{' '}
                        <a className='text-solid-coral-700 underline underline-offset-2 cursor-pointer'>multipliers</a>.
                    </Text>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                    <div className='h-4000 rounded-300 bg-solid-slate-100' />
                </div>
            </div>
            {/* CFD Apps */}
            <div className='p-1200 rounded-1200 border-xs border-solid border-opacity-black-100'>
                <div className='pb-1200'>
                    <div className='flex items-center gap-200'>
                        <Heading.H4>CFDs</Heading.H4>
                        <Button className='no-underline' colorStyle='coral' size='sm' variant='tertiary'>
                            Compare Accounts
                        </Button>
                    </div>
                    <Text size='sm'>
                        Trade with leverage and tight spreads for better returns on trades.{' '}
                        <a className='text-solid-coral-700 underline underline-offset-2 cursor-pointer'>Learn more</a>
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
                    <div>
                        <Text bold className='pb-800' size='md'>
                            Deriv cTrader
                        </Text>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                        </div>
                    </div>
                    <div>
                        <Text bold className='pb-800' size='md'>
                            Other CFDs
                        </Text>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                            <div className='h-4000 rounded-300 bg-solid-slate-100' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default TradersHubRoute;
