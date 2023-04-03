import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import LanguageSettings from '../language-settings';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
}));

jest.mock('@deriv/translations', () => {
    const original_module = jest.requireActual('@deriv/translations');
    return {
        ...original_module,
        getAllowedLanguages: jest.fn(() => ({ lang_1: 'Test Lang 1', lang_2: 'Test Lang 2' })),
    };
});

describe('LanguageSettings', () => {
    const mockRootStore = mockStore({
        common: {
            current_language: 'lang_1',
            isCurrentLanguage: jest.fn(() => false),
        },
    });
    it('should render LanguageSettings and change language', async () => {
        render(<LanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const lang_el_1 = screen.getByText('Test Lang 1');
        const lang_el_2 = screen.getByText('Test Lang 2');
        const submit_btn = screen.getByRole('button');

        expect(lang_el_1).toBeInTheDocument();
        expect(lang_el_1.className.split(' ').includes('settings-language__language-name--active')).toBeTruthy();
        expect(lang_el_2).toBeInTheDocument();
        expect(lang_el_2.className.split(' ').includes('settings-language__language-name--active')).toBeFalsy();

        userEvent.click(lang_el_2);

        expect(lang_el_1.className.split(' ').includes('settings-language__language-name--active')).toBeFalsy();
        expect(lang_el_2.className.split(' ').includes('settings-language__language-name--active')).toBeTruthy();

        userEvent.click(submit_btn);
        await waitFor(() => {
            expect(mockRootStore.common.changeSelectedLanguage).toHaveBeenCalled();
        });
    });
});
