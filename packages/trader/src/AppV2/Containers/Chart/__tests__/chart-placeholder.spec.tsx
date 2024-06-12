import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartPlaceholder from '../chart-placeholder';

describe('ChartPlaceholder', () => {
    it('should render the chart placeholder with correct text', () => {
        render(<ChartPlaceholder />);
        const placeholderText = screen.getByText('Placeholder Chart');
        expect(placeholderText).toBeInTheDocument();
    });
});
