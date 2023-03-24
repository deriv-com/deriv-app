import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageRadioButton, { TLanguageRadioButton } from '../language-radio-button';

jest.mock('@deriv/translations', () => {
    const original_module = jest.requireActual('@deriv/translations');
    return {
        ...original_module,
        getAllowedLanguages: jest.fn(() => ({ lang_1: 'Test Lang 1', lang_2: 'Test lang 2' })),
    };
});

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>Flag Icon</div>),
    };
});

describe('LanguageRadioButton', () => {
    const mock_props: TLanguageRadioButton = {
        is_current_language: true,
        id: 'test id',
        language_code: 'lang_1',
        name: 'Test Language',
        onChange: jest.fn(),
    };

    it('should render active LanguageRadioButton', () => {
        render(<LanguageRadioButton {...mock_props} />);

        expect(screen.getByText('Flag Icon')).toBeInTheDocument();
        expect(screen.getByText('Test Lang 1')).toBeInTheDocument();
        expect(screen.getByTestId('dt_language_settings_button')).toHaveClass(
            'settings-language__language-link--active'
        );
    });

    it('should render not active LanguageRadioButton and trigger onchange', () => {
        mock_props.is_current_language = false;

        render(<LanguageRadioButton {...mock_props} />);

        expect(screen.getByText('Flag Icon')).toBeInTheDocument();
        expect(screen.getByText('Test Lang 1')).toBeInTheDocument();
        expect(screen.getByTestId('dt_language_settings_button')).not.toHaveClass(
            'settings-language__language-link--active'
        );

        const btn = screen.getByRole('radio');
        expect(btn).toHaveClass('settings-language__language--radio-button');
        expect(btn).toHaveAttribute('id', 'test id');
        expect(btn).toHaveAttribute('name', 'Test Language');
        userEvent.click(btn);
        expect(mock_props.onChange).toHaveBeenCalled();
    });
});
