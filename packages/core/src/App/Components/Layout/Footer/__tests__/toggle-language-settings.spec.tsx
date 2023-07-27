import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { ToggleLanguageSettings } from '../toggle-language-settings';
import { TranslationProvider } from '@deriv/translations';
import { TStores } from '@deriv/stores/types';
import { WS } from '@deriv/shared';

jest.mock('../../../../Containers/SettingsModal/settings-language', () => jest.fn(() => <div>LanguageSettings</div>));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        wait: jest.fn(() => Promise.resolve()),
        authorized: {
            send: jest.fn(() =>
                Promise.resolve({
                    get_settings: {
                        preferred_language: 'EN',
                    },
                })
            ),
        },
    },
}));

describe('ToggleLanguageSettings Component', () => {
    const renderWithProviders = (mock_root_store: TStores) => {
        return render(<ToggleLanguageSettings />, {
            wrapper: ({ children }) => (
                <TranslationProvider websocket={WS}>
                    <StoreProvider store={mock_root_store}>{children}</StoreProvider>
                </TranslationProvider>
            ),
        });
    };

    it('should has "ic-settings-active" class when "is_settings_visible" is true', () => {
        const mock_root_store = mockStore({ ui: { is_language_settings_modal_on: true } });

        renderWithProviders(mock_root_store);

        const link = screen.getByTestId('dt_toggle_language_settings');
        expect(link).toHaveClass('ic-settings--active');
    });
    it('should call "toggleSettings" function when the user clicked on the link', () => {
        const mock_root_store = mockStore({});

        renderWithProviders(mock_root_store);

        const link = screen.getByTestId('dt_toggle_language_settings');
        userEvent.click(link);
        expect(mock_root_store.ui.toggleLanguageSettingsModal).toHaveBeenCalled();
    });
});
