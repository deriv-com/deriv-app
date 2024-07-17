import React, { useEffect, useState } from 'react';
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
