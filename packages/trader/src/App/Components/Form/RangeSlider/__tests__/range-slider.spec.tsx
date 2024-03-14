import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RangeSlider from '../range-slider';

describe('RangeSlider', () => {
    const mocked_default_props = {
        max_value: 10,
        min_value: 1,
        name: 'test_name',
        onChange: jest.fn(),
        value: 1,
    };

    it('should show 1 Tick if the value is 1', () => {
        render(<RangeSlider {...mocked_default_props} />);

        expect(screen.getByText('1 Tick')).toBeInTheDocument();
    });

    it('should show 2 Ticks if the value is 2', () => {
        render(<RangeSlider {...mocked_default_props} value={2} />);

        expect(screen.getByText('2 Ticks')).toBeInTheDocument();
    });

    it('should call onChange if user changed input value', () => {
        render(<RangeSlider {...mocked_default_props} />);

        const input = screen.getByLabelText('range-input');
        userEvent.type(input, '5');
        expect(mocked_default_props.onChange).toBeCalled();
    });
});
