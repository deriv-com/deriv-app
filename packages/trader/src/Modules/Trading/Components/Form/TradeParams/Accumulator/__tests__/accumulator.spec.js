import React from 'react';
import { render, screen } from '@testing-library/react';
import Accumulator from '../accumulator';

const mock_connect_props = {
    accumulator_range_list: [0.01, 0.02, 0.03, 0.04, 0.05],
    onChange: jest.fn(),
    growth_rate: 0.01,
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

describe('Accumulator', () => {
    it('should render with the initially selected 1% growth_rate', () => {
        render(<Accumulator />);
        expect(screen.getByText('Accumulate')).toBeInTheDocument();
        expect(screen.getByText('1%')).toBeInTheDocument();
        expect(screen.getByText('2%')).toBeInTheDocument();
        expect(screen.getByText('3%')).toBeInTheDocument();
        expect(screen.getByText('4%')).toBeInTheDocument();
        expect(screen.getByText('5%')).toBeInTheDocument();
        expect(screen.getByText('1%').getAttribute('class')).toContain('--selected');
    });

    it('3% growth_rate should be selected when 0.03 is a currently selected and stored growth_rate value', () => {
        mock_connect_props.growth_rate = 0.03;
        render(<Accumulator />);
        expect(screen.getByText('3%').getAttribute('class')).toContain('--selected');
        expect(screen.getByText('1%').getAttribute('class')).not.toContain('--selected');
    });
});
