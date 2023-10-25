import React from 'react';
import { render, screen } from '@testing-library/react';
import DurationRangeText from '../duration-range-text';

const mocked_props = {
    min: 1,
    max: 1440,
    duration_unit_text: 'minutes',
};

describe('<DurationRangeText />', () => {
    it('should render component with proper text', () => {
        render(<DurationRangeText {...mocked_props} />);

        expect(screen.getByText(/Range: 1 - 1,440 minutes/i)).toBeInTheDocument();
    });
});
