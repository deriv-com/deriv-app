import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CurrentSpotDisplay from '../current-spot-display';

describe('CurrentSpotDisplay', () => {
    const mocked_props = {
        has_tick_count: false,
        spot: '389.45',
        tick: null,
    };

    it('should not render if spot prop is null', () => {
        const { container } = render(<CurrentSpotDisplay {...mocked_props} spot={null} />);
        expect(container).toBeEmptyDOMElement();
    });
    it('should render spot value without tick count when spot prop is provided while tick={null} and has_tick_count={false}', () => {
        render(<CurrentSpotDisplay {...mocked_props} />);

        expect(screen.getByText(mocked_props.spot.slice(0, -1))).toBeInTheDocument();
        expect(screen.getByText(mocked_props.spot.slice(-1))).toBeInTheDocument();
        expect(screen.queryByText(/Tick/)).not.toBeInTheDocument();
    });
    it('should render tick count when tick prop is provided and has_tick_count={true}', () => {
        render(<CurrentSpotDisplay {...mocked_props} tick={2} has_tick_count />);

        expect(screen.getByText('Tick 2')).toBeInTheDocument();
    });
    it('should update last digit upon spot update', async () => {
        jest.useFakeTimers();
        const { rerender } = render(<CurrentSpotDisplay {...mocked_props} />);
        expect(screen.getByText(mocked_props.spot.slice(0, -1))).toBeInTheDocument();

        rerender(<CurrentSpotDisplay {...mocked_props} spot='389.49' />);
        await waitFor(() => {
            jest.advanceTimersByTime(240); // equal to total animation time
            expect(screen.getByText('9')).toBeInTheDocument();
        });

        rerender(<CurrentSpotDisplay {...mocked_props} spot='389.51' />);
        await waitFor(() => {
            jest.advanceTimersByTime(240); // equal to total animation time
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });
});
