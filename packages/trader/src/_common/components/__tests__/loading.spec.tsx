import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

const mock_props = {
    className: 'test_className',
    is_invisible: false,
    id: 'barspinner_id',
};

describe('Loading', () => {
    const test_id = 'dt_barspinner';

    it('should render a Loading component', () => {
        render(<Loading {...mock_props} />);
        const loading_container = screen.getByTestId(test_id);

        expect(loading_container).toBeInTheDocument();
        expect(loading_container).toHaveClass('barspinner barspinner--dark test_className');
    });
    it('should render a Loading component with proper class if the theme was passed', () => {
        render(<Loading {...mock_props} theme='light' />);

        expect(screen.getByTestId(test_id)).toHaveClass('barspinner barspinner--light test_className');
    });
});
