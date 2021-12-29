import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TickSteps from '../tick-steps.jsx';

describe('TickSteps', () => {
    const min_value = 1;
    const max_value = 10;
    const arr_ticks = [...Array(max_value - min_value + 1).keys()];
    it.each(arr_ticks)('should render 10 tick steps', item => {
        const wrapper = render(<TickSteps min_value={min_value} max_value={max_value} />);
        expect(wrapper.getAllByTestId(`tick_step_${item + min_value}`)).toHaveLength(1);
    });
});
