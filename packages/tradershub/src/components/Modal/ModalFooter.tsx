import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';
import { ModalFooterClass, TModalFooterClass } from './Modal.classnames';

/**
 * Interface for the ModalFooter component props
 * @interface TModalFooter
 * @extends {TModalFooterClass}
 * @property {ReactNode} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 */
export interface TModalFooter extends TModalFooterClass {
    children: ReactNode;
    className?: string;
}

/**
 * ModalFooter component
 * @param {TModalFooter} props - The properties that define the ModalFooter component.
 * @returns {JSX.Element} The ModalFooter component.
 */
const ModalFooter = ({ align = 'right', children, className }: TModalFooter) => (
    <div className={qtMerge(ModalFooterClass({ align }), className)}>{children}</div>
);

export default ModalFooter;
