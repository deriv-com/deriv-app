import React from 'react';
import { useTranslation } from 'react-i18next';
import { localize, getAllowedLanguages } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormSubHeader from 'Components/form-sub-header';
import LanguageRadioButton from 'Components/language-settings';
import TCoreStore from '../../../Stores';

type TLanguageSettings = {
    current_language: string;
    changeSelectedLanguage: (lang: string) => void;
};

const LanguageSettings = ({ changeSelectedLanguage, current_language }: TLanguageSettings) => {
    const { i18n } = useTranslation();
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
                            is_current_language={current_language === language_key}
                            name='language-radio-group'
                            onChange={async () => {
                                changeSelectedLanguage(language_key);
                                await i18n.changeLanguage?.(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default connect(({ common }: TCoreStore) => ({
    changeSelectedLanguage: common.changeSelectedLanguage,
    current_language: common.current_language,
}))(LanguageSettings);
