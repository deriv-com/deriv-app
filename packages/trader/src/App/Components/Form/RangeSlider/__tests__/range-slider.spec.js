import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RangeSlider from '../range-slider';

describe('RangeSlider', () => {
    it('should show  1 Tick if the value is 1', () => {
        const value = 1;
        const wrapper = render(<RangeSlider value={value} />);
        expect(wrapper.getAllByText('1 Tick')).toHaveLength(1);
    });

    it('should show 2 Ticks if the value is 2', () => {
        const value = 2;
        const wrapper = render(<RangeSlider value={value} />);
        expect(wrapper.getAllByText('2 Ticks')).toHaveLength(1);
    });

    it('should change the input with onchange target value', () => {
        const ChangeMock = jest.fn();
        const wrapper = render(<RangeSlider onChange={ChangeMock} />);
        const input = wrapper.getByLabelText('range-input');
        fireEvent.change(input, { target: { value: 5 } });
        expect(input.value).toBe('5');
    });
});
