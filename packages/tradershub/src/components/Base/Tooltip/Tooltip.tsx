import React from 'react';
import { qtMerge, Text } from '@deriv/quill-design';

type TProps = {
    alignment?: 'bottom' | 'left' | 'right' | 'top';
    className?: string;
    isVisible: boolean;
    message: string;
};

const Tooltip: React.FC<React.PropsWithChildren<TProps>> = ({
    alignment = 'left',
    children,
    className,
    isVisible,
    message,
}) => {
    return (
        <div className={qtMerge('relative w-max h-max', className)}>
            {children}
            {isVisible && (
                <div className={`absolute z-10 flex items-center transform-${alignment} ${className ?? ''}`}>
                    <div className={`bg-system-light-active-background w-200 h-400 clip-path-${alignment}`} />
                    <div className='w-max max-w-[22rem] p-200 rounded-md leading-[1.8rem] whitespace-pre-wrap bg-system-light-active-background'>
                        <Text size='sm'>{message}</Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
