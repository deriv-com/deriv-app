import React from 'react';

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
        <div className={`relative w-max h-max ${className ?? ''}`}>
            {children}
            {isVisible && (
                <div className={`absolute z-10 flex items-center transform-${alignment} ${className ?? ''}`}>
                    <div className={`bg-[#d6dadb] w-1 h-2 clip-path-${alignment}`} />
                    <div className='w-max max-w-[22rem] p-2 rounded-md text-[1.2rem] leading-[1.8rem] whitespace-pre-wrap bg-[#d6dadb]'>
                        {message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
