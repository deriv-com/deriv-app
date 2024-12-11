import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages, useTranslations } from '@deriv-com/translations';
import { LanguageLink } from 'App/Components/Routes';
import { UNSUPPORTED_LANGUAGES } from '@deriv/shared';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const LanguageSettings = observer(() => {
    const { ui } = useStore();
    const { toggleLanguageSettingsModal } = ui;
    const { currentLang } = useTranslations();

    const allowed_languages = Object.keys(getAllowedLanguages(UNSUPPORTED_LANGUAGES));

    return (
        <div className='settings-language'>
            <div className='settings-language__language-container'>
                {allowed_languages.map(lang =>
                    isCurrentLanguage(lang, currentLang) ? (
                        <LanguageLink key={lang} lang={lang} />
                    ) : (
                        <LanguageLink key={lang} is_clickable lang={lang} toggleModal={toggleLanguageSettingsModal} />
                    )
                )}
            </div>
        </div>
    );
});

export default LanguageSettings;
