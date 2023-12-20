import React from 'react';
import { render, screen } from '@testing-library/react';
import DurationRangeText from '../duration-range-text';

describe('<DurationRangeText />', () => {
    it('should render component with a proper text for seconds', () => {
        render(<DurationRangeText min={15} max={86400} duration_unit_text='seconds' />);

        expect(screen.getByText(/Range: 15 - 86,400 seconds/i)).toBeInTheDocument();
    });
    it('should render component with a proper text for minutes', () => {
        render(<DurationRangeText min={1} max={1440} duration_unit_text='minutes' />);

        expect(screen.getByText(/Range: 1 - 1,440 minutes/i)).toBeInTheDocument();
    });
    it('should render component with a proper text for hours', () => {
        render(<DurationRangeText min={1} max={24} duration_unit_text='hours' />);

        expect(screen.getByText(/Range: 1 - 24 hours/i)).toBeInTheDocument();
    });
});
