import React from 'react';
import { APIProvider } from '@deriv/api-v2';
import { getInitialLanguage, initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
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
    const i18nLanguage = localStorage.getItem('i18n_language') ?? getInitialLanguage();
    const defaultLanguage = i18nLanguage === 'AR' ? 'AR' : 'EN';

    return (
        <APIProvider standalone>
            <WalletsAuthProvider>
                <TranslationProvider defaultLang={defaultLanguage} i18nInstance={i18nInstance}>
                    <React.Suspense fallback={<Loader />}>
                        <ModalProvider>
                            <AppContent />
                        </ModalProvider>
                    </React.Suspense>
                </TranslationProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

export default App;
