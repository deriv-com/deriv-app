import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TCFDPlatformLayout = {
    children: ReactNode;
    title: string;
};

const CFDPlatformLayout = ({ children, title }: TCFDPlatformLayout) => (
    <div className='pb-8 border-solid border-b-1 border-b-system-light-hover-background'>
        <Text className='pb-16' weight='bold'>
            {title}
        </Text>
        <div className='grid grid-cols-1 gap-y-16 gap-x-48 lg:grid-cols-3'>{children}</div>
    </div>
);

export default CFDPlatformLayout;
