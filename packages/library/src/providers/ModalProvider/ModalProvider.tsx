import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    ReactNode,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { useBreakpoint } from '@deriv/quill-design';

type TModalState = {
    // Add your modal states here
    modalType?: string; // Just an example
};

type TModalContext = {
    getModalState: <T extends keyof TModalState>(key: T) => TModalState[T];
    hide: () => void;
    isOpen: boolean;
    modalState?: Map<keyof TModalState, TModalState[keyof TModalState]>;
    setModalOptions: Dispatch<SetStateAction<TModalOptions>>;
    setModalState: <T extends keyof TModalState>(key: T, value: TModalState[T]) => void;
    show: (ModalContent: ReactNode, options?: TModalOptions) => void;
};

type TModalOptions = {
    defaultRootId?: 'v2_modal_root' | 'v2_modal_show_header_root';
    rootRef?: RefObject<HTMLElement>;
    shouldHideDerivAppHeader?: boolean;
};

const ModalContext = createContext<TModalContext | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context)
        throw new Error(
            'useModal() must be called within a component wrapped in ModalProvider. Please import Provider from @deriv/library'
        );

    return context;
};

export const ModalProvider = ({ children }: PropsWithChildren<unknown>) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<ReactNode | null>();
    const [modalOptions, setModalOptions] = useState<TModalOptions>({});
    const [modalState, setModalState] = useState<Map<keyof TModalState, TModalState[keyof TModalState]>>(new Map());
    const { isDesktop } = useBreakpoint();

    const rootRef = useRef<HTMLElement>(document.getElementById('v2_modal_root'));
    const rootHeaderRef = useRef<HTMLElement | null>(document.getElementById('v2_modal_show_header_root'));

    const getModalState = useCallback(
        <T extends keyof TModalState>(key: T): TModalState[T] => {
            return modalState.get(key) as TModalState[T];
        },
        [modalState]
    );

    const updateModalState = useCallback(
        <T extends keyof TModalState>(key: T, value: TModalState[T]) => {
            setModalState(new Map(modalState.set(key, value)));
        },
        [modalState]
    );

    const show = useCallback(
        (ModalContent: ReactNode, options?: TModalOptions) => {
            setContent(ModalContent);
            setModalOptions({
                ...modalOptions,
                ...options,
            });
        },
        [modalOptions]
    );

    useEffect(() => {
        if (!rootHeaderRef.current) {
            rootHeaderRef.current = document.getElementById('v2_modal_show_header_root');
        }
    }, []);

    const hide = () => {
        setContent(null);
    };

    useOnClickOutside(modalRef, isDesktop ? hide : () => undefined);

    const modalRootRef = useMemo(() => {
        // if they specify their own root, prioritize this first
        if (modalOptions?.rootRef?.current) return modalOptions?.rootRef;
        // if user specifically specify they want to show on root or hide the Deriv.app header
        if (modalOptions?.shouldHideDerivAppHeader || modalOptions?.defaultRootId === 'v2_modal_root') return rootRef;
        // otherwise do the default behaviour, show Deriv.app header if on responsive
        if (modalOptions?.defaultRootId === 'v2_modal_show_header_root' || !isDesktop) return rootHeaderRef;
        return rootRef;
    }, [modalOptions?.rootRef, modalOptions?.shouldHideDerivAppHeader, modalOptions?.defaultRootId, isDesktop]);

    const providerValue = useMemo(
        () => ({
            getModalState,
            hide,
            isOpen: content !== null,
            modalState,
            setModalOptions,
            setModalState: updateModalState,
            show,
        }),
        [content, getModalState, modalState, show, updateModalState]
    );

    return (
        <ModalContext.Provider value={providerValue}>
            {children}
            {modalRootRef?.current &&
                content &&
                createPortal(<div ref={modalRef}>{content}</div>, modalRootRef.current)}
        </ModalContext.Provider>
    );
};
