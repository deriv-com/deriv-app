import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import useDevice from '../../hooks/useDevice';
import { TPlatforms, TMarketTypes } from '../../types';

type TModalState = {
    marketType?: TMarketTypes.All;
    platform?: TPlatforms.All;
};

type TModalContext = {
    getModalState: <T extends keyof TModalState>(key: T) => TModalState[T];
    hide: () => void;
    isOpen: boolean;
    modalState?: Map<keyof TModalState, TModalState[keyof TModalState]>;
    setModalState: <T extends keyof TModalState>(key: T, value: TModalState[T]) => void;
    show: (ModalContent: React.ReactNode, options?: TModalOptions) => void;
};

type TModalOptions = {
    defaultRootId?: 'wallets_modal_responsive_root' | 'wallets_modal_root';
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
    const [modalOptions, setModalOptions] = useState<TModalOptions>({});
    const [modalState, setModalState] = useState<Map<keyof TModalState, TModalState[keyof TModalState]>>(new Map());
    const { isDesktop } = useDevice();

    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));
    const rootResponsiveRef = useRef<HTMLElement | null>(document.getElementById('wallets_modal_responsive_root'));

    const getModalState = <T extends keyof TModalState>(key: T): TModalState[T] => {
        return modalState.get(key) as TModalState[T];
    };

    const updateModalState = <T extends keyof TModalState>(key: T, value: TModalState[T]) => {
        setModalState(new Map(modalState.set(key, value)));
    };

    const show = (ModalContent: React.ReactNode, options?: TModalOptions) => {
        setContent(ModalContent);
        setModalOptions({
            ...modalOptions,
            ...options,
        });
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
        if (modalOptions?.rootRef?.current) return modalOptions?.rootRef;
        if (isDesktop || modalOptions?.defaultRootId === 'wallets_modal_root') return rootRef;
        return rootResponsiveRef;
    }, [isDesktop, modalOptions]);

    return (
        <ModalContext.Provider
            value={{ getModalState, hide, isOpen: content !== null, modalState, setModalState: updateModalState, show }}
        >
            {children}
            {modalRootRef?.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, modalRootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
