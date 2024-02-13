import React, { FC, PropsWithChildren } from 'react';
import { qtMerge } from '@deriv/quill-design';

type TButtonGroupProps = { className?: string };

/**
 * `ButtonGroup` is a functional component that displays its children in a flex container.
 * It uses the `qtMerge` function from `@deriv/quill-design` to combine predefined styles with any additional styles passed in through the `className` prop.
 *
 * @param {PropsWithChildren<TButtonGroupProps>} props - The properties that define the `ButtonGroup` component.
 * @param {React.ReactNode} props.children - The child elements to be displayed within the `ButtonGroup`.
 * @param {string} [props.className] - Additional CSS classes to apply to the `ButtonGroup`.
 *
 * @returns {React.ReactElement} A `div` element with the `ButtonGroup`'s children and the combined styles.
 */

const ButtonGroup: FC<PropsWithChildren<TButtonGroupProps>> = ({ children, className }) => (
    <div className={qtMerge('flex flex-col align-center gap-8 lg:flex-row ', className)}> {children}</div>
);

export default ButtonGroup;
