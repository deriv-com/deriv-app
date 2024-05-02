import React from 'react';
import { DemoRealSwitcher } from '@/components';
import { Text } from '@deriv-com/ui';

const TradersHubHeader = () => {
    return (
        <div className='flex flex-col gap-8 lg:items-center lg:gap-12 lg:flex-row w-1/2 lg:w-auto'>
            <Text size='xl' weight='bold'>
                Trader&apos;s Hub
            </Text>
            <DemoRealSwitcher />
        </div>
    );
};

export default TradersHubHeader;
