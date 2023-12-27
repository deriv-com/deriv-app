import React, { ReactElement } from 'react';
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
 *
 * @example
 * ```tsx
 * <Modal className="my-modal">
 *   <Modal.Header>My Modal</Modal.Header>
 *   <Modal.Content>Modal content goes here</Modal.Content>
 *   <Modal.Footer>OK</Modal.Footer>
 * </Modal>
 * ```
 */
type TModal = {
    children: TModalChildren | TModalChildren[];
    className?: string;
};

/**
 * Modal component
 * @param {TModal} props - The properties that define the Modal component.
 * @returns {JSX.Element} The Modal component.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <Modal.Header title="Title"/>
 *   <Modal.Content>Modal content goes here</Modal.Content>
 *   <Modal.Footer>
 *      <Button>Primary Action</Button>
 *      <Button variant='secondary'>Secondary Action</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
const Modal = ({ children, className }: TModal) => {
    return (
        <div
            className={qtMerge(
                'flex flex-col h-screen w-screen bg-background-primary-base lg:mx-auto lg:h-full lg:w-full lg:rounded-400',
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
