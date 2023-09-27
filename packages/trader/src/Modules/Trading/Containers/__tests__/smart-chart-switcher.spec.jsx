import React from 'react';
import { screen, render } from '@testing-library/react';
import SmartChartSwitcher from '../smart-chart-switcher';

describe('SmartChartSwitcher', () => {
    it('renders SmartChart with correct props', () => {
        const mockProps = {
            is_alpha: false,
        };

        render(<SmartChartSwitcher {...mockProps} />);
        const smartChart = screen.getByTestId('SmartChart');

        expect(smartChart).toBeInTheDocument();
    });
});
