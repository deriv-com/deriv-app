import React, { useMemo } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { getInitialLanguage, initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import './styles/fonts.scss';
import './index.scss';

type LanguageType = 'AR' | 'EN';

const App: React.FC = () => {
    const defaultLanguage = (localStorage.getItem('i18n_language') ?? getInitialLanguage()) as LanguageType;

    const i18nInstance = useMemo(
        () =>
            initializeI18n({
                cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultLanguage]
    );

    // eslint-disable-next-line no-console
    console.log(i18nInstance);
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
