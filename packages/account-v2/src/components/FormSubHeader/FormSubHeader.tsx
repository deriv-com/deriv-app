import React from 'react';
import { Text } from '@deriv-com/ui';

export const FormSubHeader = ({ children }: React.PropsWithChildren) => (
    <div className='flex justify-star'>
        <Text as='p' className='pr-8 text-nowrap' size='sm' weight='bold'>
            {children}
        </Text>
        <div className='self-center border-t-1 border-solid border-solid-grey-2 h-full w-full mt-3' />
    </div>
);
