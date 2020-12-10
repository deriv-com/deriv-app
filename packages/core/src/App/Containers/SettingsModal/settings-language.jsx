import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getAllowedLanguages, changeLanguage, currentLanguage } from 'Utils/Language';

const isCurrentLanguage = lang => lang === currentLanguage;

const NonClickableLink = ({ children, lang }) => (
    <div
        id={`dt_settings_${lang}_button`}
        className={classNames('settings-language__language-link', {
            'settings-language__language-link--active': isCurrentLanguage(lang),
        })}
    >
        {children}
    </div>
);

const LanguageLink = ({ lang }) => (
    <React.Fragment>
        <Icon
            icon={`IcFlag${lang.replace('_', '-')}`}
            className={'settings-language__language-link-flag settings-language__language-flag'}
            type={lang.replace(/(\s|_)/, '-').toLowerCase()}
        />
        <span
            className={classNames('settings-language__language-name', {
                'settings-language__language-name--active': isCurrentLanguage(lang),
            })}
        >
            {getAllowedLanguages()[lang]}
        </span>
    </React.Fragment>
);

const LanguageSettings = () => (
    <div className='settings-language'>
        <div className='settings-language__language-header'>
            <Text size='xs' color='prominent' weight='bold'>
                <Localize i18n_default_text='Select language' />
            </Text>
        </div>
        <div className='settings-language__language-container'>
            {Object.keys(getAllowedLanguages()).map(key =>
                isCurrentLanguage(key) ? (
                    <NonClickableLink lang={key} key={key}>
                        <LanguageLink lang={key} />
                    </NonClickableLink>
                ) : (
                    <span
                        id={`dt_settings_${key}_button`}
                        key={key}
                        onClick={() => changeLanguage(key)}
                        className={classNames('settings-language__language-link', {
                            'settings-language__language-link--active': isCurrentLanguage(key),
                        })}
                    >
                        <LanguageLink lang={key} key={key} />
                    </span>
                )
            )}
        </div>
    </div>
);

LanguageLink.propTypes = {
    lang: PropTypes.string,
};

NonClickableLink.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    lang: PropTypes.string,
};

export default LanguageSettings;
