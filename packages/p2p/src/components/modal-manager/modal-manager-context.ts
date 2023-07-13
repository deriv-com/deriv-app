import React from 'react';
import { TModalManagerContext } from 'Types';

export const ModalManagerContext = React.createContext<TModalManagerContext | null>(null);

export const useModalManagerContext = () => {
    const context = React.useContext(ModalManagerContext);
    if (!context) {
        throw new Error('useModalManagerContext should be used within <ModalManagerContext.Provider>.');
    }
    return context;
};
