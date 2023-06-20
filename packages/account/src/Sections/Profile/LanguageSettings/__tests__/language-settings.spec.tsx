import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isMobile, routes } from '@deriv/shared';
import LanguageSettings from '../language-settings';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/translations', () => ({
    ...jest.requireActual('@deriv/translations'),
    getAllowedLanguages: jest.fn(() => ({ lang_1: 'Test Lang 1', lang_2: 'Test Lang 2' })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>Flag Icon</div>),
}));

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => (Component: React.ReactElement) => Component,
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

describe('LanguageSettings', () => {
    const mock_props: React.ComponentProps<typeof LanguageSettings> = {
        changeSelectedLanguage: jest.fn(),
        current_language: 'lang_1',
    };

    it('should render LanguageSettings', () => {
        render(<LanguageSettings {...mock_props} />);

        expect(screen.getByText('Select Language')).toBeInTheDocument();

        const flags_icons = screen.getAllByText('Flag Icon');
        const lang_1 = screen.getByText('Test Lang 1');
        const lang_2 = screen.getByText('Test Lang 2');

        expect(flags_icons.length).toBe(2);
        expect(lang_1).toBeInTheDocument();
        expect(/(active)/i.test(lang_1.className)).toBeTruthy();
        expect(lang_2).toBeInTheDocument();
        expect(/(active)/i.test(lang_2.className)).toBeFalsy();
    });

    it('should trigger language change', () => {
        render(<LanguageSettings {...mock_props} />);

        const lang_2 = screen.getByText('Test Lang 2');
        userEvent.click(lang_2);

        expect(mock_props.changeSelectedLanguage).toHaveBeenCalled();
    });

    it('should redirect for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        render(<LanguageSettings {...mock_props} />);

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });
});
