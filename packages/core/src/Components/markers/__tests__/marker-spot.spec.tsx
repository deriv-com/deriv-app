import React from 'react';
import { render, screen } from '@testing-library/react';
import MarkerSpot from '../marker-spot.jsx';

describe('MarkerSpot Component', () => {
    it('should render MarkerSpot component', () => {
        render(<MarkerSpot spot_count={3} />);
        const text = screen.getByText(/3/i);
        expect(text).toBeInTheDocument();
    });

    it('should not has class ".chart-spot__spot--lost" or ".chart-spot__spot--won" if no status is passed in props', () => {
        render(<MarkerSpot spot_count={3} />);
        const text = screen.getByText(/3/i);
        expect(text).not.toHaveClass('.chart-spot__spot--lost');
        expect(text).not.toHaveClass('.chart-spot__spot--won');
    });
});
