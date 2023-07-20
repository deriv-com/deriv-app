import React from 'react';
import classNames from 'classnames';
import { Text, Icon } from '@deriv/components';
import { useLanguageChecks } from '@deriv/translations';
import { LanguageKey } from '@deriv/translations/src/utils/config';

export type TLanguageRadioButton = {
    is_current_language: boolean;
    id: string;
    language_code: LanguageKey;
    name: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const LanguageRadioButton = ({ is_current_language, id, language_code, name, onChange }: TLanguageRadioButton) => {
    const { allowed_languages } = useLanguageChecks();

    return (
        <div
            className={classNames('settings-language__language-link', {
                'settings-language__language-link--active': is_current_language,
            })}
            id={`dt_settings_${language_code}_button`}
            data-testid={'dt_language_settings_button'}
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
