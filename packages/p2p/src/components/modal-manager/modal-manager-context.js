import React from 'react';

export const ModalManagerContext = React.createContext();

export const useModalManagerContext = () => {
    return React.useContext(ModalManagerContext);
};
