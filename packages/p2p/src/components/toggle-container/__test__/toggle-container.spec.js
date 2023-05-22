import React from 'react';
import { render, screen } from '@testing-library/react';
import ToggleContainer from '../toggle-container.jsx';

describe('<ToggleContainer/>', () => {
    it('should act as a wrapper for the child component', () => {
        render(
            <ToggleContainer>
                <div>Child component</div>
            </ToggleContainer>
        );

        expect(screen.getByText('Child component')).toBeInTheDocument();
    });
});
