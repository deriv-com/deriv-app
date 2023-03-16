import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToggleLanguageSettings, TToggleLanguageSettings } from '../toggle-language-settings';
import userEvent from '@testing-library/user-event';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

jest.mock('../../../../Containers/SettingsModal/settings-language', () => jest.fn(() => <div>LanguageSettings</div>));

describe('ToggleSettings Component', () => {
    const mock_props: TToggleLanguageSettings = {
        is_settings_visible: false,
        lang: 'EN',
        toggleSettings: jest.fn(),
    };

    it('should has "ic-settings--active" class when "is_settings_visible" is true', () => {
        mock_props.is_settings_visible = true;

        render(<ToggleLanguageSettings {...mock_props} />);
        const link = screen.getByTestId('dt_toggle_language_settings');
        expect(link).toHaveClass('ic-settings--active');
    });
    it('should call "toggleSettings" function when the user clicked on the link', () => {
        render(<ToggleLanguageSettings {...mock_props} />);
        const link = screen.getByTestId('dt_toggle_language_settings');
        userEvent.click(link);
        expect(mock_props.toggleSettings).toHaveBeenCalledTimes(1);
    });
});
