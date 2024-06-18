import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { ModulesStoreProvider } from 'Stores/useModulesStores';
import type { TCoreStores } from '@deriv/stores/types';

export const ModulesProvider = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <StoreProvider store={store}>
            <ModulesStoreProvider>{children}</ModulesStoreProvider>
        </StoreProvider>
    );
};

export default ModulesProvider;
