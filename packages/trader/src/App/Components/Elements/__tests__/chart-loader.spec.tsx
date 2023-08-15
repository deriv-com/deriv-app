import React from 'react';
import { render, screen } from '@testing-library/react';
import ChartLoader from '../chart-loader';

const default_props = {
    is_dark: true,
    is_visible: false,
};

describe('ChartLoader', () => {
    const test_id = 'dt_barspinner';

    it('should not render ChartLoader component if is_visible  === false', () => {
        render(<ChartLoader {...default_props} />);

        expect(screen.queryByTestId(test_id)).not.toBeInTheDocument();
    });
    it('should render ChartLoader component if is_visible  === true', () => {
        default_props.is_visible = true;
        render(<ChartLoader {...default_props} />);

        expect(screen.getByTestId(test_id)).toBeInTheDocument();
    });
});
