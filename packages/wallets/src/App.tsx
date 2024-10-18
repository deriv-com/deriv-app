import React, { lazy, useMemo, useState } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalProvider } from './components/ModalProvider';
import useLanguage from './hooks/useLanguage';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import { TLanguageType } from './types';
import './styles/fonts.scss';
import './index.scss';

type TProps = {
    isWalletsOnboardingTourGuideVisible: boolean;
    onWalletsOnboardingTourGuideCloseHandler: VoidFunction;
};

const LazyWalletTourGuide = lazy(() => import('./components/WalletTourGuide/WalletTourGuide'));

const App: React.FC<TProps> = ({ isWalletsOnboardingTourGuideVisible, onWalletsOnboardingTourGuideCloseHandler }) => {
    const [preferredLanguage, setPreferredLanguage] = useState<TLanguageType | null>(null);
    const language = useLanguage(preferredLanguage);

    const i18nInstance = useMemo(
        () =>
            initializeI18n({
                cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [language]
    );
    const defaultLanguage = preferredLanguage ?? language;

    return (
        <APIProvider standalone>
            <WalletsAuthProvider>
                <TranslationProvider defaultLang={defaultLanguage} i18nInstance={i18nInstance}>
                    <React.Suspense fallback={<Loader />}>
                        <ModalProvider>
                            <AppContent
                                isWalletsOnboardingTourGuideVisible={isWalletsOnboardingTourGuideVisible}
                                setPreferredLanguage={setPreferredLanguage}
                            />
                        </ModalProvider>
                    </React.Suspense>
                    {isWalletsOnboardingTourGuideVisible && (
                        <React.Suspense fallback={<Loader />}>
                            <LazyWalletTourGuide
                                onWalletsOnboardingTourGuideCloseHandler={onWalletsOnboardingTourGuideCloseHandler}
                            />
                        </React.Suspense>
                    )}
                </TranslationProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

export default App;
