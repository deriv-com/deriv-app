import React, { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TButtonGroupProps = { className?: string };

/**
 * `ButtonGroup` is a functional component that displays its children in a flex container.
 * @param {PropsWithChildren<TButtonGroupProps>} props - The properties that define the `ButtonGroup` component.
 * @param {React.ReactNode} props.children - The child elements to be displayed within the `ButtonGroup`.
 * @param {string} [props.className] - Additional CSS classes to apply to the `ButtonGroup`.
 *
 * @returns {React.ReactElement} A `div` element with the `ButtonGroup`'s children and the combined styles.
 */

const ButtonGroup: FC<PropsWithChildren<TButtonGroupProps>> = ({ children, className }) => (
    <div className={twMerge('flex flex-col align-center gap-8 lg:flex-row ', className)}> {children}</div>
);

export default ButtonGroup;
