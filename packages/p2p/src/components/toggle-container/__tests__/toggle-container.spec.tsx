import React from 'react';
import { render, screen } from '@testing-library/react';
import ToggleContainer from '../toggle-container';

describe('<ToggleContainer/>', () => {
    it('should act as a wrapper for the child component', () => {
        render(
            <ToggleContainer>
                <div>Child component</div>
            </ToggleContainer>
        );

        expect(screen.getByTestId('dt_toggle_container')).toHaveClass('toggle-container');
        expect(screen.getByText('Child component')).toBeInTheDocument();
    });
});
