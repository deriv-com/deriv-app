import React from 'react';
import { render, screen } from '@testing-library/react';
import TickSteps from '../tick-steps';

describe('TickSteps', () => {
    const max_value = 10;
    const min_value = 1;
    const mocked_default_props = {
        max_value,
        min_value,
        name: 'test_name',
        value: 1,
        hover_value: 2,
        onClick: jest.fn(),
        onMouseEnter: jest.fn(),
        onMouseLeave: jest.fn(),
    };
    const arr_ticks = [...Array(max_value - min_value + 1).keys()];

    it.each(arr_ticks)('should render 10 tick steps', item => {
        render(<TickSteps {...mocked_default_props} />);

        expect(screen.getByTestId(`tick_step_${item + min_value}`)).toBeInTheDocument();
    });
});
