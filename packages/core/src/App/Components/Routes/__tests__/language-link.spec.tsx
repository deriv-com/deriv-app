import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TRootStore } from '@deriv/stores/types';
import { TLanguageLink } from 'App/Components/Routes/language-link';
import { LanguageLink } from '../index';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />),
}));

jest.mock('Utils/Language', () => ({
    ...jest.requireActual('Utils/Language'),
    changeLanguage: jest.fn(),
}));

describe('LanguageLink component', () => {
    const mock_props: TLanguageLink = {
        is_clickable: false,
        lang: 'ID',
        toggleModal: jest.fn(),
    };
    const mockRootStore = mockStore({});

    it('should render language icon with language when not clickable', () => {
        render(<LanguageLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Indonesian')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_settings_language_button')).not.toBeInTheDocument();
    });
    it('should render language icon with language when clickable', async () => {
        mock_props.is_clickable = true;

        render(<LanguageLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const lang_btn = screen.getByTestId('dt_settings_language_button');
        expect(screen.getByText('Indonesian')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_settings_language_button')).toBeInTheDocument();

        userEvent.click(lang_btn);

        await waitFor(() => {
            expect(mock_props.toggleModal).toBeCalled();
        });
    });
});
