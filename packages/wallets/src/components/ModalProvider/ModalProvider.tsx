import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';

type TModalContext = {
    hide: () => void;
    isOpen: boolean;
    show: (ModalContent: React.ReactNode) => void;
};

const ModalContext = React.createContext<TModalContext | null>(null);

export const useModal = () => {
    const context = React.useContext(ModalContext);

    if (!context) throw new Error('useModal() must be called within a component wrapped in ModalProvider.');

    return context;
};

const ModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = React.useState<React.ReactNode | null>();

    const rootRef = React.useRef<HTMLElement>(document.getElementById('wallets_modal_root'));

    const show = (ModalContent: React.ReactNode) => {
        setContent(ModalContent);
    };

    const hide = () => {
        setContent(null);
    };

    useOnClickOutside(modalRef, hide);

    return (
        <ModalContext.Provider value={{ hide, isOpen: content !== null, show }}>
            {children}
            {rootRef.current && content && createPortal(<div ref={modalRef}>{content}</div>, rootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
