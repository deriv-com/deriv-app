import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TotalAssetsLoader } from '@/components';
import { useTotalAssets } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Text } from '@deriv-com/ui';

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();

    if (!isSuccess) return <TotalAssetsLoader />;

    return (
        <div className='relative inline-block w-auto text-center lg:text-right'>
            <div className='d-none lg:block'>
                <Text size='sm'>Total assets</Text>
            </div>
            <Text
                as='p'
                className={twMerge(
                    'underline text-status-light-information decoration-dotted decoration-system-light-less-prominent-text underline-offset-8 flex flex-col items-end text-4xl',
                    !activeTrading?.is_virtual && 'text-status-light-success'
                )}
                weight='bold'
            >
                {totalAssets}
            </Text>
        </div>
    );
};

export default TotalAssets;
