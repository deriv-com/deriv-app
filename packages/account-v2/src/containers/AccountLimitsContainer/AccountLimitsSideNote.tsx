import React from 'react';
import { SideNote, Text } from '@deriv-com/ui';

export const AccountLimitsSideNote = () => (
    <SideNote className='md:ml-16 h-fit' title='Account limits' titleSize='sm'>
        <Text size='xs'>These are default limits that we apply to your accounts</Text>
    </SideNote>
);
