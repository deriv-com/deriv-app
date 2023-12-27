import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';

/**
 * Type for the ModalContent component props
 * @typedef TModalContent
 * @property {ReactNode} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 */
type TModalContent = {
    children: ReactNode;
    className?: string;
};

/**
 * ModalContent component
 * @param {TModalContent} props - The properties that define the ModalContent component.
 * @returns {JSX.Element} The ModalContent component.
 */
const ModalContent = ({ children, className }: TModalContent) => (
    <div className={qtMerge('flex-grow p-400 lg:flex-none', className)}>{children}</div>
);

export default ModalContent;
