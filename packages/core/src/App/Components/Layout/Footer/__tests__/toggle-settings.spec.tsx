import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ToggleSettings } from '../toggle-settings.jsx';

describe('ToggleSettings Component', () => {
    it('should has "ic-settings--active" class when "is_settings_visible" is true', () => {
        render(<ToggleSettings is_settings_visible />);
        const link = screen.getByTestId('dt_toggle_settings');
        expect(link).toHaveClass('ic-settings--active');
    });

    it('should contain "IcGear" icon', () => {
        render(<ToggleSettings />);
        const icon = screen.getByTestId('dt_icon');
        expect(icon).toBeInTheDocument();
    });

    it('should open the modal when the user clicked on the link', () => {
        render(<ToggleSettings />);
        const link = screen.getByTestId('dt_toggle_settings');
    });
});
