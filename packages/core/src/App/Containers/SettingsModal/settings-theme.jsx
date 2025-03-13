import classNames from 'classnames';
import React, { useState } from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DarkModeIcon from 'Assets/SvgComponents/settings/img-theme-dark.svg';
import LightModeIcon from 'Assets/SvgComponents/settings/img-theme-light.svg';
import { observer, useStore } from '@deriv/stores';

const ThemeSelectSettings = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode, setDarkMode } = ui;
    const [selected_variant, setSelectedVariant] = useState('default');

    const darkOnClick = () => {
        setDarkMode(true);
    };

    const lightOnClick = () => {
        setDarkMode(false);
    };

    // These functions would be implemented in a real scenario
    const handleVariantChange = variant => {
        setSelectedVariant(variant);
        // In a real implementation, this would update the theme variant in the store
    };

    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                <Text as='h4' weight='bold' size='xs' className='theme-select-settings__title'>
                    <Localize i18n_default_text='Select theme mode' />
                </Text>
                <div className='theme-select-settings__content'>
                    <div id='dt_settings_dark_button' className='theme-select-settings__option'>
                        <DarkModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': is_dark_mode,
                            })}
                            onClick={darkOnClick}
                        />
                        <p
                            className={classNames('theme-select-settings__option__title', {
                                'theme-select-settings__option__title--selected': is_dark_mode,
                            })}
                        >
                            {<Localize i18n_default_text='Dark' />}
                        </p>
                    </div>
                    <div id='dt_settings_light_button' className='theme-select-settings__option'>
                        <LightModeIcon
                            className={classNames('theme-select-settings__option__icon', {
                                'theme-select-settings__option__icon--active': !is_dark_mode,
                            })}
                            onClick={lightOnClick}
                        />
                        <p
                            className={classNames('theme-select-settings__option__title', {
                                'theme-select-settings__option__title--selected': !is_dark_mode,
                            })}
                        >
                            {<Localize i18n_default_text='Light' />}
                        </p>
                    </div>
                </div>

                {/* Theme Variants Section */}
                <Text
                    as='h4'
                    weight='bold'
                    size='xs'
                    className='theme-select-settings__title'
                    style={{ marginTop: '24px' }}
                >
                    <Localize i18n_default_text='Theme variant' />
                </Text>
                <div className='theme-select-settings__variants'>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': selected_variant === 'default',
                        })}
                        onClick={() => handleVariantChange('default')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--default' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Default' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': selected_variant === 'deriv',
                        })}
                        onClick={() => handleVariantChange('deriv')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--deriv' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Deriv' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': selected_variant === 'champion',
                        })}
                        onClick={() => handleVariantChange('champion')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--champion' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Champion' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': selected_variant === 'colourblind',
                        })}
                        onClick={() => handleVariantChange('colourblind')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--colourblind' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Colourblind' />
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});

export default ThemeSelectSettings;
