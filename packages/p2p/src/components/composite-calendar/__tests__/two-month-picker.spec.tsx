import React from 'react';
import { render, screen } from '@testing-library/react';
import TwoMonthPicker from '../two-month-picker';

const mock_props = {
    onChange: jest.fn(),
    getIsPeriodDisabled: jest.fn(),
    value: 1696319493, // 2023-10-04
};

describe('TwoMonthPicker', () => {
    it('should render the component', () => {
        render(<TwoMonthPicker {...mock_props} />);
        expect(screen.getByText('Sep')).toBeInTheDocument();
    });
});
