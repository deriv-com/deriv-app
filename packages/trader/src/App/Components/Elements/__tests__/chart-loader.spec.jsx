import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartLoader from '../chart-loader';

describe('ChartLoader', () => {
    const test_id = 'dt_barspinner';

    it('should render ChartLoader component if is_visible  === true', () => {
        render(<ChartLoader is_visible />);

        expect(screen.getByTestId(test_id)).toBeInTheDocument();
    });
    it('should render ChartLoader component if is_visible  === false', () => {
        render(<ChartLoader />);

        expect(screen.queryByTestId(test_id)).not.toBeInTheDocument();
    });
});
