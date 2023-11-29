import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpiryText from '../expiry-text';

const mocked_props = {
    expiry_epoch: 1695427199,
    has_error: false,
};

describe('<DurationRangeText />', () => {
    it('should render component with proper formatted date if has_error === false and fixed_date was not passed', () => {
        render(<ExpiryText {...mocked_props} />);

        expect(screen.getByText(/Expiry: 22 Sep 2023/i)).toBeInTheDocument();
    });

    it('should not render date if has_error === true', () => {
        render(<ExpiryText {...mocked_props} has_error />);

        expect(screen.queryByText(/Expiry: 22 Sep 2023/i)).not.toBeInTheDocument();
    });

    it('should render fixed date if it was passed', () => {
        render(<ExpiryText {...mocked_props} has_error fixed_date='20 September' />);

        expect(screen.getByText(/Expiry: 20 September/i)).toBeInTheDocument();
    });
});
