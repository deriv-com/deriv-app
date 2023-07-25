import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useLanguageChecks, useLanguageSettings } from '@deriv/translations';
import { LanguageLink } from 'App/Components/Routes';

const LanguageSettings = observer(() => {
    const { ui } = useStore();
    const { toggleLanguageSettingsModal } = ui;
    const { allowed_languages } = useLanguageChecks();
    const { current_language, handleChangeLanguage } = useLanguageSettings();

    return (
        <div className='settings-language'>
            <div className='settings-language__language-container settings-language__language-container--has-padding'>
                {Object.keys(allowed_languages).map(lang => {
                    const is_matching = lang === current_language;
                    const is_clickable = !is_matching;

                    return (
                        <LanguageLink
                            key={`language-link-${lang}`}
                            lang={lang}
                            is_active={is_matching}
                            onClick={async () => {
                                if (!is_clickable) return;
                                toggleLanguageSettingsModal();
                                await handleChangeLanguage(lang);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
