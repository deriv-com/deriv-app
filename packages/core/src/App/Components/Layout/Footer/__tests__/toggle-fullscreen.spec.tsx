import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleFullScreen } from '../toggle-fullscreen.jsx';

describe('ToggleFullScreen Component', () => {
    it('should not have "ic-fullscreen--active" class when "is_full_screen" is "false"', () => {
        render(<ToggleFullScreen />);
        const a_element = screen.getByTestId('dt_fullscreen_toggle');
        expect(a_element).not.toHaveClass('ic-fullscreen--active');
    });

    it('should have "Full screen" text when "is_full_screen" is "false"', () => {
        render(<ToggleFullScreen showPopover />);
        const popover_wrapper = screen.getByTestId('dt_popover_wrapper');
        userEvent.hover(popover_wrapper);
        const message = screen.getByText(/full screen/i);
        expect(message).toBeInTheDocument();
    });

    it('should render "IcFullScreen" icon when "is_full_screen" is "false"', () => {
        render(<ToggleFullScreen />);
        const icon = screen.getByTestId('dt_icon');
        expect(icon).toBeInTheDocument();
    });
});
