import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';
import {
    NewTooltipClassnames,
    NewTooltipClassnamesProps,
    NewTooltipContainerClassnames,
    NewTooltipContainerProps,
} from './Tooltip.classnames';

type TNewTooltip = NewTooltipClassnamesProps &
    NewTooltipContainerProps & {
        children: ReactNode;
        className?: string;
        message: string;
    };

/**
 * `Tooltip` is a reusable component that displays a tooltip message when the user hovers over the children.
 * The tooltip's position and variant can be customized.
 *
 * @component
 * @example
 * // Example usage of Tooltip
 * <Tooltip position="top" variant="general" message="This is a tooltip">
 *   Hover over me
 * </Tooltip>
 *
 * @param {ReactNode} children - The content over which the tooltip will be shown.
 * @param {string} [className] - Additional CSS classes to apply to the tooltip.
 * @param {string} message - The message to display in the tooltip.
 * @param {string} position - The position of the tooltip relative to the children. Can be 'top', 'bottom', 'left', or 'right'.
 * @param {string} variant - The variant of the tooltip. Can be 'general' or 'error'.
 *
 * @typedef {object} TNewTooltip
 * @property {ReactNode} children - The content over which the tooltip will be shown.
 * @property {string} [className] - Additional CSS classes to apply to the tooltip.
 * @property {string} message - The message to display in the tooltip.
 * @property {string} position - The position of the tooltip relative to the children.
 * @property {string} variant - The variant of the tooltip.
 */

const Tooltip = ({ children, className, message, position, variant }: TNewTooltip) => (
    <div className='relative cursor-pointer group'>
        <div className='m-200'>{children}</div>
        <span className={qtMerge(NewTooltipContainerClassnames({ position, variant }), className)}>{message}</span>
        <span className={NewTooltipClassnames({ position, variant })} />
    </div>
);

export default Tooltip;
