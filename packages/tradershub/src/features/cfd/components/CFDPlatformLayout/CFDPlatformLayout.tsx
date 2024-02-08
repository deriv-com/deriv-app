import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TCFDPlatformLayout = {
    children: ReactNode;
    title: string;
};

const CFDPlatformLayout = ({ children, title }: TCFDPlatformLayout) => (
    <div className='border-solid border-b-xs border-b-system-light-hover-background pb-400 lg:border-none'>
        <Text className='pb-800' weight='bold'>
            {title}
        </Text>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>{children}</div>
    </div>
);

export default CFDPlatformLayout;
