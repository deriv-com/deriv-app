import React, { ReactNode } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
import { TooltipClass, TooltipPointerClass } from './Tooltip.classnames';

/**
 * Props for the Tooltip component.
 * @typedef {Object} TTooltipProps
 * @property {'bottom' | 'left' | 'right' | 'top'} [alignment='left'] - The alignment of the tooltip.
 * @property {ReactNode} children - The content that triggers the tooltip.
 * @property {string} [className] - Additional CSS class for styling.
 * @property {string} message - The message to be displayed in the tooltip.
 */
type TTooltipProps = {
    alignment: 'bottom' | 'left' | 'right' | 'top';
    children: ReactNode;
    className?: string;
    isVisible: boolean;
    message: string;
};

/**
 * Tooltip component for displaying additional information.
 * @param {TTooltipProps} props - The properties that define the Tooltip component.
 * @returns {JSX.Element}
 *
 * @example
 * ```jsx
 * <Tooltip alignment='right' message='This is a tooltip message'>
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
const Tooltip = ({ alignment = 'bottom', children, className, message }: TTooltipProps) => {
    return (
        <div className='relative w-max h-max group z-1'>
            <div className='border rounded-md border-neutral-600'>{children}</div>

            <div className={qtMerge(TooltipClass({ alignment }), className)}>
                <div className={qtMerge(TooltipPointerClass({ alignment }), className)} />

                <span className='rounded-md bg-system-light-active-background p-200 '>
                    <Text size='sm'>{message}</Text>
                </span>
            </div>
        </div>
    );
};

export default Tooltip;
