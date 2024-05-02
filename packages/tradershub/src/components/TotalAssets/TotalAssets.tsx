import React from 'react';
import { twJoin } from 'tailwind-merge';
import { TotalAssetsLoader } from '@/components';
import { useTotalAssets } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';

const TotalAssets = () => {
    const { isDesktop } = useDevice();
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();

    if (!isSuccess) return <TotalAssetsLoader />;

    return (
        <div className='relative lg:inline-block text-center lg:text-right w-full lg:w-auto flex justify-center mt-24 lg:mt-0'>
            <div className='d-none lg:block'>
                <Text size='sm'>Total assets</Text>
            </div>
            <Text
                as='p'
                className={twJoin(
                    'flex flex-col items-end border-b-4 border-dotted border-system-light-less-prominent-text',
                    !activeTrading?.is_virtual ? 'text-status-light-success' : 'text-status-light-information'
                )}
                size={isDesktop ? 'xl' : '2xl'}
                weight='bold'
            >
                {totalAssets}
            </Text>
        </div>
    );
};

export default TotalAssets;
