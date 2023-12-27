import React, { FC, ReactNode } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';

/**
 * Props for the Tooltip component.
 * @typedef {Object} TProps
 * @property {'bottom' | 'left' | 'right' | 'top'} [alignment='left'] - The alignment of the tooltip.
 * @property {ReactNode} children - The content that triggers the tooltip.
 * @property {string} [className] - Additional CSS class for styling.
 * @property {boolean} isVisible - Flag indicating whether the tooltip is visible.
 * @property {string} message - The message to be displayed in the tooltip.
 */
type TProps = {
    alignment?: 'bottom' | 'left' | 'right' | 'top';
    children: ReactNode;
    className?: string;
    isVisible: boolean;
    message: string;
};

/**
 * Tooltip component for displaying additional information.
 * @param {TProps} props - The properties that define the Tooltip component.
 * @returns {JSX.Element}
 *
 * @example
 * ```jsx
 * <Tooltip alignment='right' isVisible={true} message='This is a tooltip message'>
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
const Tooltip: FC<TProps> = ({ alignment = 'left', children, className, isVisible, message }) => {
    return (
        <div className={qtMerge('relative w-max h-max', className)}>
            {children}
            {isVisible && (
                <div className={(qtMerge(`absolute z-10 flex items-center transform-${alignment}`), className)}>
                    <div className={`bg-system-light-active-background w-200 h-400 clip-path-${alignment}`} />
                    <div className='w-max max-w-[220px] p-200 rounded-md leading-100 whitespace-pre-wrap bg-system-light-active-background'>
                        <Text size='sm'>{message}</Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
