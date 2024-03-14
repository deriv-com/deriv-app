import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TIconWithMessage = {
    actionButton?: ReactNode;
    children?: ReactNode;
    icon: JSX.Element;
    title: string;
};

export const IconWithMessage = ({ actionButton, children, icon, title }: TIconWithMessage) => (
    <div className='grid justify-center w-full justify-items-center mt-80 gap-20'>
        {icon}
        <div className='grid justify-center gap-10'>
            <Text align='center' size='md' weight='bold'>
                {title}
            </Text>
            {children && <div className='grid gap-4'>{children}</div>}
        </div>
        {actionButton && <div className='mt-10'>{actionButton}</div>}
    </div>
);
