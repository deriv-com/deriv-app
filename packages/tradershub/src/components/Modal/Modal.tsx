import React, { PropsWithChildren, ReactElement } from 'react';
import { qtMerge } from '@deriv/quill-design';
import ModalContent from './ModalContent';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

/**
 * Type for the Modal children
 * @typedef TModalChildren
 * @property {ReactElement<typeof ModalContent>} ModalContent - Modal content component
 * @property {ReactElement<typeof ModalFooter>} ModalFooter - Modal footer component
 * @property {ReactElement<typeof ModalHeader>} ModalHeader - Modal header component
 */
type TModalChildren =
    | ReactElement<typeof ModalContent>
    | ReactElement<typeof ModalFooter>
    | ReactElement<typeof ModalHeader>;

/**
 * Type for the Modal component props
 * @typedef TModal
 * @property {TModalChildren | TModalChildren[]} children - Children nodes, should be one of the predefined Modal components (Header, Content, Footer)
 * @property {string} [className] - Optional CSS class name
 */
type TModal = {
    children: TModalChildren | TModalChildren[];
    className?: string;
};

/**
 * Generic type for the Modal components
 * @typedef TModalComponents
 * @property {ReactNode} children - Children nodes
 * @property {string} [className] - Optional CSS class name
 */
export type TModalComponents = PropsWithChildren<{
    className?: string;
}>;

/**
 * Modal component
 * @param {TModal} props - The properties that define the Modal component.
 * @returns {JSX.Element} The Modal component.
 */
const Modal = ({ children, className }: TModal) => {
    return (
        <div
            className={qtMerge(
                'flex flex-col h-[calc(100vh-40px)] w-screen bg-system-light-primary-background lg:mx-auto lg:h-full lg:w-full lg:rounded-400',
                className
            )}
        >
            {children}
        </div>
    );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
