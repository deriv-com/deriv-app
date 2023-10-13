import React, { createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import type { MT5AccountType } from '../ExternalTradingPlatforms';

type TModalContext = {
    hide: () => void;
    isOpen: boolean;
    modalState?: TModalState;
    setModalState: (newModalState: Partial<TModalState>) => void;
    show: (ModalContent: React.ReactNode) => void;
};

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

type TModalState = {
    marketType?: TMarketTypes;
};

const ModalContext = createContext<TModalContext | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) throw new Error('useModal() must be called within a component wrapped in ModalProvider.');

    return context;
};

const ModalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<React.ReactNode | null>();
    const modalState = useRef<TModalState>();

    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));

    const setModalState = (newModalState: Partial<TModalState>) => {
        modalState.current = {
            ...modalState.current,
            ...newModalState,
        };
    };

    const show = (ModalContent: React.ReactNode) => {
        setContent(ModalContent);
    };

    const hide = () => {
        setContent(null);
    };

    useOnClickOutside(modalRef, hide);

    return (
        <ModalContext.Provider
            value={{ hide, isOpen: content !== null, show, modalState: modalState.current, setModalState }}
        >
            {children}
            {rootRef.current && content && createPortal(<div ref={modalRef}>{content}</div>, rootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
