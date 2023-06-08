import React from 'react';
import { render, screen } from '@testing-library/react';
import SeparatorContainerLine from '../separator-container-line';

describe('<SeparatorContainer/>', () => {
    it('should render the SeparatorContainer component', () => {
        render(
            <>
                <SeparatorContainerLine />
                <div>Test</div>
            </>
        );

        expect(screen.getByTestId('dt_separator_container_line')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
