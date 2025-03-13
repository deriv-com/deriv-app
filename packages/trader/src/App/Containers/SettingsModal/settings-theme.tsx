import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

type TPrimaryVariant = 'default' | 'deriv' | 'champion';

const ThemeSelectSettings = observer(() => {
    const { ui } = useStore();
    const { theme_variant, is_colourblind_mode_on, setThemeVariant, setColourblindMode } = ui;

    // Handle selecting a primary variant (radio button behavior)
    const handlePrimaryVariantSelect = (variant: TPrimaryVariant) => {
        setThemeVariant(variant);
    };

    // Handle toggling colourblind mode
    const handleColourblindToggle = () => {
        setColourblindMode(!is_colourblind_mode_on);
    };

    return (
        <React.Fragment>
            <div className='theme-select-settings'>
                {/* Theme Variants Section */}
                <Text as='h4' weight='bold' size='xs' className='theme-select-settings__title'>
                    <Localize i18n_default_text='Theme variant' />
                </Text>
                <div className='theme-select-settings__variants'>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': theme_variant === 'default',
                        })}
                        onClick={() => handlePrimaryVariantSelect('default')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--default' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Default' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': theme_variant === 'deriv',
                        })}
                        onClick={() => handlePrimaryVariantSelect('deriv')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--deriv' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Deriv' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': theme_variant === 'champion',
                        })}
                        onClick={() => handlePrimaryVariantSelect('champion')}
                    >
                        <div className='theme-select-settings__variant-color theme-select-settings__variant-color--champion' />
                        <p className='theme-select-settings__variant-label'>
                            <Localize i18n_default_text='Champion' />
                        </p>
                    </div>
                    <div
                        className={classNames('theme-select-settings__variant-option', {
                            'theme-select-settings__variant-option--active': is_colourblind_mode_on,
                        })}
                        onClick={handleColourblindToggle}
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
