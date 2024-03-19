import React from 'react';
import { Divider, Text } from '@deriv-com/ui';

export const FormSubHeader = ({ children }: React.PropsWithChildren) => (
    <div className='flex justify-star'>
        <Text as='p' className='pr-8 text-nowrap' size='sm' weight='bold'>
            {children}
        </Text>
        <Divider className='self-center w-full mt-3' color='#f2f3f4' />
    </div>
);
