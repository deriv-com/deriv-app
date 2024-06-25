import React from 'react';
import CashierStoreProvider from '@deriv/cashier/src/cashier-providers';
import CFDStoreProvider from '@deriv/cfd/src/cfd-providers';
import { StoreProvider } from '@deriv/stores';
import { TranslationProvider } from '@deriv-com/translations';
import AppContent from './app-content';
import './app.scss';

type TProps = {
    passthrough: {
        root_store: React.ComponentProps<typeof StoreProvider>['store'];
        i18nInstance: Parameters<typeof TranslationProvider>[0]['i18nInstance'];
        language: Exclude<Parameters<typeof TranslationProvider>[0]['defaultLang'], undefined>;
    };
};

const App: React.FC<TProps> = ({ passthrough: { root_store, i18nInstance, language } }) => (
    <TranslationProvider defaultLang={language} i18nInstance={i18nInstance}>
        <CashierStoreProvider store={root_store}>
            <CFDStoreProvider store={root_store}>
                <AppContent />
            </CFDStoreProvider>
        </CashierStoreProvider>
    </TranslationProvider>
);

export default App;
