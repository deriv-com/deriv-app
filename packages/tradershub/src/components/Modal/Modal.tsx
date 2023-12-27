import React, { ReactNode } from 'react';
import { qtMerge } from '@deriv/quill-design';
import ModalContent from './ModalContent';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

type TModal = {
    children: ReactNode;
    className?: string;
};

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
