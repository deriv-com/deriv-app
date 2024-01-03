import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { TModalComponents } from './Modal';

/**
 * ModalContent component
 * @param {TModalComponents} props - The properties that define the ModalContent component.
 * @property {ReactNode} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 * @returns {JSX.Element} The ModalContent component.
 */
const ModalContent = ({ children, className }: TModalComponents) => (
    <div className={qtMerge('flex-grow p-400 lg:flex-none', className)}>{children}</div>
);

export default ModalContent;
