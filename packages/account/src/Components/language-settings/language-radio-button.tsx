import React from 'react';
import { Text, Icon } from '@deriv/components';
import classNames from 'classnames';
import { getAllowedLanguages } from '@deriv/translations';

type TLanguageRadioButton = {
    is_current_language: boolean;
    id: string;
    language_code: string;
    name: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const LanguageRadioButton = ({ is_current_language, id, language_code, name, onChange }: TLanguageRadioButton) => {
    const allowed_languages: Record<string, string> = getAllowedLanguages();
    return (
        <div
            className={classNames('settings-language__language-link', {
                'settings-language__language-link--active': is_current_language,
            })}
            id={`dt_settings_${language_code}_button`}
        >
            <input
                type='radio'
                id={id}
                name={name}
                onChange={onChange}
                value={language_code}
                className='settings-language__language--radio-button'
            />
            <label htmlFor={id} className='settings-language__language--center-label'>
                <div>
                    <Icon
                        icon={`IcFlag${id.replace('_', '-')}`}
                        className='settings-language__language-link-flag settings-language__language-flag'
                    />
                </div>
                <div>
                    <Text
                        size='xs'
                        className={classNames('settings-language__language-name', {
                            'settings-language__language-name--active': is_current_language,
                        })}
                    >
                        {allowed_languages[language_code]}
                    </Text>
                </div>
            </label>
        </div>
    );
};

export default LanguageRadioButton;
