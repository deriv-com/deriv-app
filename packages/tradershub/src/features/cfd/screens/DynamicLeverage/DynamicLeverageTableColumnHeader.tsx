import React from 'react';
import { Text } from '@deriv-com/ui';

type TDynamicLeverageTableColumnHeader = {
    subtitle: string;
    title: string;
};

export const DynamicLeverageTableColumnHeader = ({ subtitle, title }: TDynamicLeverageTableColumnHeader) => (
    <div className='flex flex-col'>
        <Text align='center' size='sm' weight='bold'>
            {title}
        </Text>
        <Text align='center' size='xs'>
            {subtitle}
        </Text>
    </div>
);
