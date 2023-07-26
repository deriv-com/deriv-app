import React from 'react';
import { screen, render } from '@testing-library/react';
import LanguageLink, { TLanguageLink } from '../language-link';
import { TranslationProvider } from '@deriv/translations';
import { WS } from '@deriv/shared';

jest.mock('@deriv/components', () => ({
    Icon: jest.fn(({ icon_classname }) => <div data-testid='dt_mocked_icon' className={icon_classname} />),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    __esModule: true, // this property makes it work,
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

describe('LanguageLink component', () => {
    const mock_props: TLanguageLink = {
        is_active: false,
        lang: 'ID',
    };

    const renderWithProvider = (props: TLanguageLink) => {
        render(
            <TranslationProvider websocket={WS} environment='local'>
                <LanguageLink {...props} />
            </TranslationProvider>
        );
    };

    it('should render language link with active classname without active classname when not active', () => {
        renderWithProvider(mock_props);

        expect(screen.getByText('Indonesian')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();

        const language_link = screen.getByTestId(`dt_settings_${mock_props.lang}_button`);
        expect(language_link).toBeInTheDocument();
        expect(language_link).not.toHaveClass('settings-language__language-link--active');
    });

    it('should render language link with active classname when active', () => {
        mock_props.is_active = true;
        mock_props.lang = 'FR';

        renderWithProvider(mock_props);

        expect(screen.getByText('Français')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();

        const language_link = screen.getByTestId(`dt_settings_${mock_props.lang}_button`);
        expect(language_link).toBeInTheDocument();
        expect(language_link).toHaveClass('settings-language__language-link--active');
    });
});
