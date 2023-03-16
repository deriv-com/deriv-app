import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageLink } from '../index';
import { TLanguageLink } from 'App/Components/Routes/language-link';

jest.mock('react-i18next', () => {
    return {
        ...jest.requireActual('react-i18next'),
        useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
    };
});

jest.mock('@deriv/components', () => {
    return {
        ...jest.requireActual('@deriv/components'),
        Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />),
    };
});

jest.mock('Utils/Language', () => {
    return {
        ...jest.requireActual('Utils/Language'),
        changeLanguage: jest.fn(),
    };
});

jest.mock('@deriv/stores', () => ({
    ...jest.requireActual('@deriv/stores'),
    useStore: jest.fn().mockReturnValue({
        common: {
            current_language: 'EN',
            changeCurrentLanguage: jest.fn(),
        },
    }),
}));

describe('LanguageLink component', () => {
    const mock_props: TLanguageLink = {
        is_clickable: false,
        lang: 'ID',
        toggleModal: jest.fn(),
    };

    it('should render language icon with language when not clickable', () => {
        render(<LanguageLink {...mock_props} />);

        expect(screen.getByText('Indonesian')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_settings_language_button')).not.toBeInTheDocument();
    });
    it('should render language icon with language when clickable', async () => {
        mock_props.is_clickable = true;

        render(<LanguageLink {...mock_props} />);

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
