import React from 'react';
import { useActiveTradingAccount, useTotalAssets } from '@deriv/api';
import { Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import { Tooltip } from '../Tooltip';

const Loader = () => <div className='flex animate-pulse bg-solid-slate-100 w-5000 h-2000 rounded-200' />;

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();

    const { isDesktop } = useBreakpoint();
    const HeadingTag = isDesktop ? Heading.H3 : Heading.H2;

    if (!isSuccess) return <Loader />;

    return (
        <div className='relative inline-block w-auto text-center lg:text-right'>
            {isDesktop && <Text size='sm'>Total assets</Text>}
            <Tooltip
                className='w-[280px] text-left'
                message='Total assets in your Deriv Apps and Deriv MT5 CFDs demo account.'
                position={isDesktop ? 'left' : 'top'}
            >
                <HeadingTag
                    className={qtMerge(
                        'underline text-status-light-information decoration-dotted decoration-system-light-less-prominent-text underline-offset-8',
                        !activeTrading?.is_virtual && 'text-status-light-success'
                    )}
                >
                    {totalAssets}
                </HeadingTag>
            </Tooltip>
        </div>
    );
};

export default TotalAssets;
