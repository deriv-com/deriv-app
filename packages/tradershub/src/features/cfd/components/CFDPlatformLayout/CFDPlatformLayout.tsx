import React, { ReactNode } from 'react';
import { Text } from '@deriv/quill-design';

type TCFDPlatformLayout = {
    children: ReactNode;
    title: string;
};

const CFDPlatformLayout = ({ children, title }: TCFDPlatformLayout) => (
    <div className='border-solid border-b-xs border-b-system-light-hover-background pb-400 lg:border-none'>
        <Text bold className='pb-800'>
            {title}
        </Text>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>{children}</div>
    </div>
);

export default CFDPlatformLayout;
