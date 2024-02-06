import React from 'react';
import { useTotalAssets } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api';
import { Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import { TotalAssetsLoader } from '../Loaders';

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();

    const { isDesktop } = useBreakpoint();
    const HeadingTag = isDesktop ? Heading.H3 : Heading.H2;

    if (!isSuccess) return <TotalAssetsLoader />;

    return (
        <div className='relative inline-block w-auto text-center lg:text-right'>
            {isDesktop && <Text size='sm'>Total assets</Text>}
            <HeadingTag
                className={qtMerge(
                    'underline text-status-light-information decoration-dotted decoration-system-light-less-prominent-text underline-offset-8',
                    !activeTrading?.is_virtual && 'text-status-light-success'
                )}
            >
                {totalAssets}
            </HeadingTag>
        </div>
    );
};

export default TotalAssets;
