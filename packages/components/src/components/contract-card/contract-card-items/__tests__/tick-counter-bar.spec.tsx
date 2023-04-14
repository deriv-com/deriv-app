import React from 'react';
import { render, screen } from '@testing-library/react';
import TickCounterBar from '../tick-counter-bar';

type TTickCounterBar = React.ComponentProps<typeof TickCounterBar>;

describe('TickCounterBar', () => {
    const mock_props: TTickCounterBar = {
        current_tick: 12345,
        label: 'Ticks',
        max_ticks_duration: 67890,
    };
    it('should render properly', () => {
        render(<TickCounterBar {...mock_props} />);

        const ticks_info_el = screen.getByText('12345/67890 Ticks');
        expect(ticks_info_el).toHaveClass('dc-tick-counter-bar__text');
    });
});
