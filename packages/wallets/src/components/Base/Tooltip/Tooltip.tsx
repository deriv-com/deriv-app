import React from 'react';
import './Tooltip.scss';

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
        <div className={`wallets-tooltip`}>
            {children}
            {isVisible && (
                <div className={`wallets-tooltip__content wallets-tooltip__content--${alignment} ${className ?? ''}`}>
                    <div className={`wallets-tooltip__arrow wallets-tooltip__arrow--${alignment}`} />
                    <div className='wallets-tooltip__message'>{message}</div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
