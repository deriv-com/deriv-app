import React from 'react';
import { useStore } from '@deriv/stores';
import ModulesStore from './Modules';

const ModulesStoreContext = React.createContext<ModulesStore | null>(null);

export const ModulesStoreProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const { modules } = useStore();
    return <ModulesStoreContext.Provider value={modules as ModulesStore}>{children}</ModulesStoreContext.Provider>;
};

export const useModulesStore = () => {
    const store = React.useContext(ModulesStoreContext);

    if (!store) {
        throw new Error('useModulesStore must be used within ModulesStoreProvider');
    }

    return store;
};
