import React from 'react';
import { render, screen } from '@testing-library/react';
import SeparatorContainerLine from '../separator-container-line';

describe('<SeparatorContainer/>', () => {
    it('should render the SeparatorContainer component', () => {
        render(<SeparatorContainerLine />);

        expect(screen.getByTestId('dt_separator_container_line')).toBeInTheDocument();
    });
});
