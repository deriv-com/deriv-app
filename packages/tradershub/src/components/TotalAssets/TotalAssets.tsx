import React from 'react';
import { clsx } from 'clsx';
import { TotalAssetsLoader } from '@/components';
import { useTotalAssets } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api';
import { Text, useDevice } from '@deriv-com/ui';

const TotalAssets = () => {
    const { data: totalAssets, isSuccess } = useTotalAssets();
    const { data: activeTrading } = useActiveTradingAccount();

    const { isDesktop } = useDevice();

    if (!isSuccess) return <TotalAssetsLoader />;

    return (
        <div className='relative inline-block w-auto text-center lg:text-right'>
            {isDesktop && <Text size='sm'>Total assets</Text>}
            <Text
                as='p'
                className={clsx(
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
