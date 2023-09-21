import { createContext, useContext } from 'react';

export type TModalContext = {
    show_test_modal: boolean;
    setShowTestModal: (v: boolean) => void;
};

export const ModalContext = createContext<TModalContext>({} as TModalContext);

export const useModalContext = () => useContext(ModalContext);
