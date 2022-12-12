import React from 'react';
import { render, screen } from '@testing-library/react';
import TickCounterBar from '../tick-counter-bar';

describe('TickCounterBar', () => {
    const mock_props = {
        current_tick: 12345,
        max_ticks_duration: 67890,
    };

    it('should render properly', () => {
        const { container } = render(<TickCounterBar {...mock_props} />);

        const ticks_info_el = screen.getByText('12345/67890 Ticks');
        expect(ticks_info_el).toHaveClass('dc-tick-counter-bar__text');
        expect(container.querySelector('.dc-tick-counter-bar__track')).toBeInTheDocument();
    });
});
