import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { TModalComponents } from './Modal';
import { ModalFooterClass, TModalFooterClass } from './Modal.classnames';

/**
 * Type for the ModalFooter component props
 * @typedef TModalFooter
 * @property {string} [align] - Optional alignment for the footer content. Default is 'right'.
 * @property {ReactNode} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 * @extends TModalComponents
 * @extends TModalFooterClass
 */
type TModalFooter = TModalComponents & TModalFooterClass;

/**
 * ModalFooter component
 * @param {TModalFooter} props - The properties that define the ModalFooter component.
 * @returns {JSX.Element} The ModalFooter component.
 */
const ModalFooter = ({ align = 'right', children, className }: TModalFooter) => (
    <div className={qtMerge(ModalFooterClass({ align }), className)}>{children}</div>
);

export default ModalFooter;
