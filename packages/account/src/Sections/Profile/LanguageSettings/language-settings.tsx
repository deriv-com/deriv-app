import { Redirect } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';
import { getAllowedLanguages } from '@deriv/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import LanguageRadioButton from '../../../Components/language-settings';
import { useEffect } from 'react';

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { switchLanguage, currentLang, localize } = useTranslations();
    const { has_wallet } = client;
    // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
    const { changeSelectedLanguage, current_language } = common;

    const { is_mobile } = ui;

    // [TODO]: Remove useEffect() when whole app starts to use @deriv-com/translations
    useEffect(() => {
        switchLanguage(current_language);
    }, [current_language, switchLanguage]);

    if (is_mobile || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_language_keys: string[] = Object.keys(getAllowedLanguages());
    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select Language')} />
            <div className='settings-language__language-container'>
                {allowed_language_keys.map(language_key => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_code={language_key}
                            is_current_language={currentLang === language_key}
                            name='language-radio-group'
                            onChange={() => {
                                switchLanguage(language_key);
                                // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
                                changeSelectedLanguage(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
