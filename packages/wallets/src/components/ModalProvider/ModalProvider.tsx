import React from 'react';
import { createPortal } from 'react-dom';

type TModalContext = {
    isOpen: boolean;
    show: (ModalContent: React.ReactNode) => void;
    hide: () => void;
};

const ModalContext = React.createContext<TModalContext | null>(null);

export const useModal = () => {
    const context = React.useContext(ModalContext);

    if (!context) throw new Error('useModal() must be called within a component wrapped in ModalProvider.');

    return context;
};

const ModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [content, setContent] = React.useState<React.ReactNode | null>();

    const rootRef = React.useRef<HTMLElement>(document.getElementById('wallets_modal_root'));

    const show = (ModalContent: React.ReactNode) => {
        setIsOpen(true);
        setContent(ModalContent);
    };

    const hide = () => {
        setIsOpen(false);
        setContent(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, hide, show }}>
            {children}
            {rootRef.current && createPortal(content, rootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
