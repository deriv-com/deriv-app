import { Text } from '@deriv-com/quill-ui';
import React from 'react';
import clsx from 'clsx';

const CardWrapper = ({
    title,
    children,
    className,
}: {
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={clsx('card-wrapper', className)}>
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
