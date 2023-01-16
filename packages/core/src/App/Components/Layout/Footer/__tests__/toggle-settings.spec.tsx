import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ToggleSettings } from '../toggle-settings.jsx';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect:
        () =>
        <T,>(Component: T) =>
            Component,
}));

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

    it('should call "toggleSettings" function when the user clicked on the link', () => {
        const toggleSettings = jest.fn();
        render(<ToggleSettings toggleSettings={toggleSettings} />);
        const link = screen.getByTestId('dt_toggle_settings');
        fireEvent.click(link);
        expect(toggleSettings).toHaveBeenCalledTimes(1);
    });
});
