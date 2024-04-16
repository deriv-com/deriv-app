import React from 'react';
import { useDynamicLeverageModalState } from '@cfd/components';
import { StandaloneArrowLeftBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

export const DynamicLeverageTitle = () => {
    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='flex items-center h-auto gap-16 py-12 pl-24 pr-16 border-solid border-b-1 border-system-light-secondary-background'>
            <StandaloneArrowLeftBoldIcon className='flex items-center cursor-pointer' onClick={toggleDynamicLeverage} />
            <Text weight='bold'>Get more out of Deriv MT5 Financial</Text>
        </div>
    );
};

export default DynamicLeverageTitle;
