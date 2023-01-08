// TODO refactor old tests in this component
import React from 'react';
import { ToggleFullScreen } from '../toggle-fullscreen.jsx';
import { Icon } from '@deriv/components';
import { render, screen } from '@testing-library/react';

describe('ToggleFullScreen Component', () => {
    it('should not have "ic-fullscreen--active" class when "is_full_screen" is false', () => {
        render(<ToggleFullScreen />);
        const aElement = screen.getByTestId('dt_fullscreen_toggle');
        expect(aElement).not.toHaveClass('ic-fullscreen--active');
    });

    // it('should have "Full screen" text when "is_full_screen" is false', () => {
    //     render(<ToggleFullScreen />);
    // });

    // it('should render "IcFullScreen" icon when "is_full_screen" is false', () => {
    //     render(<ToggleFullScreen />);
    // });
});
