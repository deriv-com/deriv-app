import React, { useContext } from 'react';

type TMT5MigrationModalContext = {
    show_modal_front_side: boolean;
    setShowModalFrontSide: React.Dispatch<React.SetStateAction<boolean>>;
    setMigrationError: React.Dispatch<React.SetStateAction<string>>;
};

export const MT5MigrationModalContext = React.createContext<TMT5MigrationModalContext>({
    show_modal_front_side: false,
    setShowModalFrontSide: () => null,
    setMigrationError: () => null,
});

export const useMT5MigrationModalContext = () => useContext(MT5MigrationModalContext);
