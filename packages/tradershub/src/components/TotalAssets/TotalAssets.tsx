import React from 'react';
import { useActiveTradingAccount, useTotalAssets } from '@deriv/api';
import { Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';

const Loader = () => <div className='flex animate-pulse bg-solid-slate-100 w-5000 h-2000 rounded-200' />;

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();
    const { isMobile } = useBreakpoint();

    if (!isSuccess) return <Loader />;

    const headingProps = {
        children: totalAssets,
        className: qtMerge(
            'underline',
            'text-status-light-information',
            'decoration-dotted',
            'decoration-system-light-less-prominent-text',
            'underline-offset-8',
            !activeTrading?.is_virtual && 'text-status-light-success'
        ),
    };

    return (
        <div className='flex flex-col items-end justify-end'>
            {!isMobile && <Text size='sm'>Total assets</Text>}
            {isMobile ? <Heading.H2 {...headingProps} /> : <Heading.H3 {...headingProps} />}
        </div>
    );
};

export default TotalAssets;
