import React from 'react';
import { render, screen } from '@testing-library/react';
import TickCounterBar from '../tick-counter-bar';

describe('TickCounterBar', () => {
    const mock_props = {
        current_tick: 12345,
        label: 'Ticks',
    };
    it('should render properly', () => {
        render(<TickCounterBar {...mock_props} />);

        const ticks_info_el = screen.getByText('12345 Ticks');
        expect(ticks_info_el).toHaveClass('dc-tick-counter-bar__text');
    });
});
