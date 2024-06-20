import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TLanguageLink } from 'App/Components/Routes/language-link';
import { LanguageLink } from '../index';

jest.mock('@deriv-com/translations');

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    TranslationFlag: { VI: () => <div>Tiếng Việt Flag</div> },
}));

jest.mock('Utils/Language', () => ({
    ...jest.requireActual('Utils/Language'),
    changeLanguage: jest.fn(),
}));

describe('LanguageLink component', () => {
    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'VI',
            localize: jest.fn().mockImplementation(key => key),
            switchLanguage: jest.fn(),
        });
    });

    const mock_props: TLanguageLink = {
        is_clickable: false,
        lang: 'VI',
        toggleModal: jest.fn(),
    };
    const mockRootStore = mockStore({});

    it('should render language icon with language when not clickable', () => {
        render(<LanguageLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Tiếng Việt')).toBeInTheDocument();
        expect(screen.getByText('Tiếng Việt Flag')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_settings_language_button')).not.toBeInTheDocument();
    });
    it('should render language icon with language when clickable', async () => {
        mock_props.is_clickable = true;

        render(<LanguageLink {...mock_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const lang_btn = screen.getByTestId('dt_settings_language_button');
        expect(screen.getByText('Tiếng Việt')).toBeInTheDocument();
        expect(screen.getByText('Tiếng Việt Flag')).toBeInTheDocument();
        expect(screen.getByTestId('dt_settings_language_button')).toBeInTheDocument();

        userEvent.click(lang_btn);

        await waitFor(() => {
            expect(mock_props.toggleModal).toBeCalled();
        });
    });
});
