import React, { useEffect, useState } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useTranslations } from '@deriv-com/translations';
import { DesktopLanguagesModal } from '@deriv-com/ui';
import { languages } from './constants/languages';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import './AppContent.scss';

const AppContent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentLang, switchLanguage } = useTranslations();

    useEffect(() => {
        const handleShortcutKey = (event: globalThis.KeyboardEvent) => {
            if (event.ctrlKey && event.key === '\\') {
                setIsModalOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleShortcutKey);

        return () => {
            window.removeEventListener('keydown', handleShortcutKey);
        };
    }, [setIsModalOpen]);

    useEffect(() => {
        defineViewportHeight();
    }, []);

    useEffect(() => {
        // TODO: remove `@ts-expect-error` after @deriv-com/analytics version update
        //@ts-expect-error temporary suppress ts error until we update @deriv-com/analytics to the latest version
        Analytics.trackEvent('ce_wallets_homepage_form', {
            action: 'open',
            form_name: 'ce_wallets_homepage_form',
        });
    }, []);

    return (
        <div className='wallets-app' key={`wallets_app_${currentLang}`}>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
            <DesktopLanguagesModal
                headerTitle='Wallets Translations [FOR TESTING PURPOSES]'
                isModalOpen={isModalOpen}
                languages={languages}
                onClose={() => setIsModalOpen(false)}
                onLanguageSwitch={switchLanguage}
                selectedLanguage={currentLang}
            />
        </div>
    );
};

export default AppContent;
