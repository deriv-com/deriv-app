import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageRadioButton, { TLanguageRadioButton } from '../language-radio-button';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    TranslationFlag: { lang_id: () => <div>Language 1 Flag</div> },
}));

describe('LanguageRadioButton', () => {
    const mock_props: TLanguageRadioButton = {
        is_current_language: true,
        id: 'lang_id',
        language_text: 'Lang 1',
        name: 'Test Language',
        onChange: jest.fn(),
    };

    it('should render active LanguageRadioButton', () => {
        render(<LanguageRadioButton {...mock_props} />);

        expect(screen.getByText('Lang 1')).toBeInTheDocument();
        expect(screen.getByText('Language 1 Flag')).toBeInTheDocument();
        expect(screen.getByTestId('dt_language_settings_button')).toHaveClass(
            'settings-language__language-link--active'
        );
    });

    it('should render not active LanguageRadioButton and trigger onchange', () => {
        mock_props.is_current_language = false;

        render(<LanguageRadioButton {...mock_props} />);

        expect(screen.getByText('Lang 1')).toBeInTheDocument();
        expect(screen.getByText('Language 1 Flag')).toBeInTheDocument();
        expect(screen.getByTestId('dt_language_settings_button')).not.toHaveClass(
            'settings-language__language-link--active'
        );

        const button = screen.getByRole('radio');
        expect(button).toHaveClass('settings-language__language--radio-button');
        expect(button).toHaveAttribute('id', 'lang_id');
        expect(button).toHaveAttribute('name', 'Test Language');
        userEvent.click(button);
        expect(mock_props.onChange).toHaveBeenCalled();
    });
});
