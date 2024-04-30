import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type TAppContainerProps = {
    children: ReactNode;
    className?: string;
};

/**
 *  `AppContainer` is a component that wraps the entire application with some base styles.
 * @param {React.ReactNode} children - The children to be rendered within the `AppContainer`.
 * @returns {React.ElementType} The `AppContainer` component.
 */

const AppContainer = ({ children, className }: TAppContainerProps) => (
    <div className={twMerge('font-sans w-full p-20 lg:max-w-[1232px] lg:py-50 lg:px-0 mx-auto', className)}>
        {children}
    </div>
);

export default AppContainer;
