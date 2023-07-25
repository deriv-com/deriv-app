import React from 'react';
import { StoreProvider } from '@deriv/stores';
import { ReportsStoreProvider } from 'Stores/useReportsStores';
import type { TCoreStores } from '@deriv/stores/types';

export const ReportsProviders = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    return (
        <StoreProvider store={store}>
            <ReportsStoreProvider>{children}</ReportsStoreProvider>
        </StoreProvider>
    );
};

export default ReportsProviders;
