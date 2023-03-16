import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStore } from '@deriv/stores';
import { ToggleLanguageSettings } from '../toggle-language-settings';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    useStore: jest.fn().mockReturnValue({
        ui: {
            is_language_settings_modal_on: false,
            toggleLanguageSettingsModal: jest.fn(),
        },
        common: { current_language: 'EN' },
    }),
}));

jest.mock('../../../../Containers/SettingsModal/settings-language', () => jest.fn(() => <div>LanguageSettings</div>));

describe('ToggleLanguageSettings Component', () => {
    it('should has "ic-settings-active" class when "is_settings_visible" is true', () => {
        useStore().ui.is_language_settings_modal_on = true;
        render(<ToggleLanguageSettings />);
        const link = screen.getByTestId('dt_toggle_language_settings');
        expect(link).toHaveClass('ic-settings--active');
    });
    it('should call "toggleSettings" function when the user clicked on the link', () => {
        render(<ToggleLanguageSettings />);
        const link = screen.getByTestId('dt_toggle_language_settings');
        userEvent.click(link);
        expect(useStore().ui.toggleLanguageSettingsModal).toHaveBeenCalled();
    });
});
