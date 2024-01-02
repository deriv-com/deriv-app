import React from 'react';
import { useTotalAssets } from '@deriv/api';
import { Heading, Text } from '@deriv/quill-design';

const Loader = () => <div className='flex animate-pulse bg-solid-slate-100 w-5000 h-2000 rounded-200' />;

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();

    if (!isSuccess) return <Loader />;

    return (
        <div className='flex flex-col items-end justify-end'>
            <Text size='sm'>Total assets</Text>
            <Heading.H3 className='underline text-status-light-information decoration-dotted decoration-system-light-less-prominent-text underline-offset-8'>
                {totalAssets}
            </Heading.H3>
        </div>
    );
};

export default TotalAssets;
