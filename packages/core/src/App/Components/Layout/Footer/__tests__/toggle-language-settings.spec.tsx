import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TRootStore } from '@deriv/stores/types';
import { ToggleLanguageSettings } from '../toggle-language-settings';

jest.mock('../../../../Containers/SettingsModal/settings-language', () => jest.fn(() => <div>LanguageSettings</div>));

describe('ToggleLanguageSettings Component', () => {
    let mockRootStore: TRootStore;

    beforeEach(() => {
        mockRootStore = mockStore({
            common: { current_language: 'EN' },
            ui: { is_language_settings_modal_on: false, toggleLanguageSettingsModal: jest.fn() },
        });
    });

    it('should has "ic-settings-active" class when "is_settings_visible" is true', () => {
        mockRootStore.ui.is_language_settings_modal_on = true;

        render(
            <StoreProvider store={mockRootStore}>
                <ToggleLanguageSettings />
            </StoreProvider>
        );

        const link = screen.getByTestId('dt_toggle_language_settings');
        expect(link).toHaveClass('ic-settings--active');
    });
    it('should call "toggleSettings" function when the user clicked on the link', () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ToggleLanguageSettings />
            </StoreProvider>
        );
        const link = screen.getByTestId('dt_toggle_language_settings');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleLanguageSettingsModal).toHaveBeenCalled();
    });
});
