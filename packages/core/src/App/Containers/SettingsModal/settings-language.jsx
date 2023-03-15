import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Icon, Text } from '@deriv/components';
import { Localize, getAllowedLanguages } from '@deriv/translations';
import { changeLanguage } from 'Utils/Language';
import { connect } from 'Stores/connect';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

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

const LanguageSettings = ({
    changeCurrentLanguage,
    current_language,
    is_pre_appstore,
    toggleLanguageSettingsModal,
    toggleSettingsModal,
}) => {
    const { i18n } = useTranslation();
    return (
        <div className='settings-language'>
            {!is_pre_appstore && (
                <div className='settings-language__language-header'>
                    <Text size='xs' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Select language' />
                    </Text>
                </div>
            )}
            <div
                className={classNames('settings-language__language-container', {
                    'settings-language__language-container--pre-appstore': is_pre_appstore,
                })}
            >
                {Object.keys(getAllowedLanguages()).map(key =>
                    isCurrentLanguage(key) ? (
                        <NonClickableLink lang={key} key={key}>
                            <LanguageLink lang={key} />
                        </NonClickableLink>
                    ) : (
                        <span
                            id={`dt_settings_${key}_button`}
                            key={key}
                            onClick={async () => {
                                await changeLanguage(key, changeCurrentLanguage);
                                await i18n.changeLanguage(key);
                                if (is_pre_appstore) {
                                    toggleLanguageSettingsModal();
                                } else {
                                    toggleSettingsModal();
                                }
                            }}
                            className={classNames('settings-language__language-link', {
                                'settings-language__language-link--active': isCurrentLanguage(key, current_language),
                            })}
                        >
                            <LanguageLink lang={key} key={key} />
                        </span>
                    )
                )}
            </div>
        </div>
    );
};

LanguageLink.propTypes = {
    lang: PropTypes.string,
};

NonClickableLink.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    lang: PropTypes.string,
};

export default connect(({ client, common, ui }) => ({
    changeCurrentLanguage: common.changeCurrentLanguage,
    current_language: common.current_language,
    toggleLanguageSettingsModal: ui.toggleLanguageSettingsModal,
    toggleSettingsModal: ui.toggleSettingsModal,
    is_pre_appstore: client.is_pre_appstore,
}))(LanguageSettings);
