import { Text } from '@deriv-com/quill-ui';
import React from 'react';

const CardWrapper = ({ title, children }: { title?: string; children: React.ReactNode }) => {
    return (
        <div className='card-wrapper'>
            {title && (
                <Text size='sm' bold className='title'>
                    {title}
                </Text>
            )}
            {children}
        </div>
    );
};

export default CardWrapper;
