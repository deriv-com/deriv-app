import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { useDevice } from '@deriv-com/ui';
import { THooks, TMarketTypes, TPlatforms } from '../../types';
import { useIsHubRedirectionEnabled, useSettings } from '@deriv/api-v2';

type TModalState = {
    accountId?: string;
    marketType?: TMarketTypes.All;
    platform?: TPlatforms.All;
    selectedJurisdiction?: THooks.AvailableMT5Accounts['shortcode'];
};

type TModalContext = {
    getModalState: <T extends keyof TModalState>(key: T) => TModalState[T];
    hide: () => void;
    isOpen: boolean;
    modalState?: Map<keyof TModalState, TModalState[keyof TModalState]>;
    setModalOptions: React.Dispatch<React.SetStateAction<TModalOptions>>;
    setModalState: <T extends keyof TModalState>(key: T, value: TModalState[T]) => void;
    show: (ModalContent: React.ReactNode, options?: TModalOptions) => void;
};

type TModalOptions = {
    defaultRootId?: 'wallets_modal_root' | 'wallets_modal_show_header_root';
    rootRef?: React.RefObject<HTMLElement>;
    shouldCloseOnClickOutside?: boolean;
    shouldHideDerivAppHeader?: boolean;
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
    const history = useHistory();
    const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
    const { data: accountSettings } = useSettings();
    const { trading_hub: tradingHub } = accountSettings;

    const rootRef = useRef<HTMLElement>(document.getElementById('wallets_modal_root'));
    const rootHeaderRef = useRef<HTMLElement | null>(document.getElementById('wallets_modal_show_header_root'));

    const getModalState = <T extends keyof TModalState>(key: T): TModalState[T] => {
        return modalState.get(key) as TModalState[T];
    };

    const updateModalState = <T extends keyof TModalState>(key: T, value: TModalState[T]) => {
        setModalState(new Map(modalState.set(key, value)));
    };

    const show = (ModalContent: React.ReactNode, options?: TModalOptions) => {
        setContent(ModalContent);
        setModalOptions(prevModalOptions => ({
            ...prevModalOptions,
            ...options,
        }));
        history.push('?modal-open=true');
    };

    useEffect(() => {
        if (!rootHeaderRef.current) {
            rootHeaderRef.current = document.getElementById('wallets_modal_show_header_root');
        }
    }, []);

    const hide = () => {
        setContent(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('modal-open');
        window.history.replaceState({}, document.title, url.toString());
        // Remove rootref to change back to default root
        setModalOptions(prevModalOptions => ({
            ...prevModalOptions,
            rootRef: undefined,
        }));
        // We need to add this check here because wallets account is coming from Low-Code tradershub.
        // This condition is to reload the page when the modal is closed.
        if (isHubRedirectionEnabled || !!tradingHub) {
            window.location.reload();
        }
    };

    const onClickOutsideHandler = () =>
        modalOptions?.shouldCloseOnClickOutside === false || !isDesktop ? () => undefined : hide;

    useOnClickOutside(modalRef, onClickOutsideHandler);

    const modalRootRef = useMemo(() => {
        // if they specify their own root, prioritize this first
        if (modalOptions?.rootRef?.current) return modalOptions?.rootRef;
        // if user specifically specify they want to show on root or hide the Deriv.app header
        if (modalOptions?.shouldHideDerivAppHeader || modalOptions?.defaultRootId === 'wallets_modal_root')
            return rootRef;
        // otherwise do the default behaviour, show Deriv.app header if on responsive
        if (modalOptions?.defaultRootId === 'wallets_modal_show_header_root' || !isDesktop) return rootHeaderRef;
        return rootRef;
    }, [modalOptions?.rootRef, modalOptions?.shouldHideDerivAppHeader, modalOptions?.defaultRootId, isDesktop]);

    return (
        <ModalContext.Provider
            value={{
                getModalState,
                hide,
                isOpen: content !== null,
                modalState,
                setModalOptions,
                setModalState: updateModalState,
                show,
            }}
        >
            {children}
            {modalRootRef?.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, modalRootRef.current)}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
