import React, { RefObject, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { MT5AccountType } from '../../features/cfd/screens';
import useDevice from '../../hooks/useDevice';

type TModalContext = {
    hide: () => void;
    isOpen: boolean;
    modalState?: TModalState;
    setModalState: (newModalState: Partial<TModalState>) => void;
    show: (ModalContent: React.ReactNode, options?: TModalShowOptions) => void;
};

type TMarketTypes = React.ComponentProps<typeof MT5AccountType>['selectedMarketType'];

type TModalState = {
    marketType?: TMarketTypes;
    platform?: string;
};

type TModalShowOptions = {
    rootRef?: React.RefObject<HTMLElement>;
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
    const { isDesktop } = useDevice();

    const [customRootRef, setCustomRootRef] = useState<RefObject<HTMLElement> | null>(null);
    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));
    const rootResponsiveRef = useRef<HTMLElement | null>(document.getElementById('wallets_modal_responsive_root'));

    const setModalState = (newModalState: Partial<TModalState>) => {
        modalState.current = {
            ...modalState.current,
            ...newModalState,
        };
    };

    const show = (ModalContent: React.ReactNode, options?: TModalShowOptions) => {
        setContent(ModalContent);
        setCustomRootRef(options?.rootRef?.current ? options?.rootRef : null);
    };

    useEffect(() => {
        if (!rootResponsiveRef.current) {
            rootResponsiveRef.current = document.getElementById('wallets_modal_responsive_root');
        }
    }, []);

    const hide = () => {
        setContent(null);
    };

    useOnClickOutside(modalRef, isDesktop ? hide : () => undefined);

    const modalRootRef = useMemo(() => {
        if (customRootRef?.current) return customRootRef;
        if (isDesktop) return rootRef;
        return rootResponsiveRef;
    }, [isDesktop, customRootRef]);

    return (
        <ModalContext.Provider
            value={{ hide, isOpen: content !== null, modalState: modalState.current, setModalState, show }}
        >
            {children}
            {modalRootRef?.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, modalRootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
