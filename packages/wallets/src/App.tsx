import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import './styles/fonts.scss';
import './index.scss';

const App: React.FC = () => {
    const i18nInstance = initializeI18n({
        cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
        useSuspense: false,
    });

    return (
        <APIProvider standalone>
            <WalletsAuthProvider>
                <ModalProvider>
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <AppContent />
                    </TranslationProvider>
                </ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

export default App;
