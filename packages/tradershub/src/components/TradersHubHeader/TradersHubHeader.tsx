import React from 'react';
import { DemoRealSwitcher } from '@/components';
import { Text } from '@deriv-com/ui';

const TradersHubHeader = () => {
    return (
        <div className='flex flex-col gap-4 lg:flex-row'>
            <Text weight='bold'>Trader&apos;s Hub</Text>
            <DemoRealSwitcher />
        </div>
    );
};

export default TradersHubHeader;
