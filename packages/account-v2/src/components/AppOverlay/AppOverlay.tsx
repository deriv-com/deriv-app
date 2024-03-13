import React, { ReactNode } from 'react';
import { StandaloneXmarkRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TAppOverlayProps = {
    children: ReactNode;
    title: ReactNode;
};

export const AppOverlay = ({ children, title }: TAppOverlayProps) => (
    <div className='w-full h-full overflow-x-auto lg:px-20'>
        <div className='sticky d-none lg:flex items-center border-solid z-[999] border-b-1 py-0 px-10 top-0 h-50 border-system-light-secondary-background'>
            <div className='flex justify-center w-full'>
                <Text size='xl' weight='bold'>
                    {title}
                </Text>
            </div>
            {/* Implement routing for close */}
            <StandaloneXmarkRegularIcon className='cursor-pointer' />
        </div>
        {children}
    </div>
);
