import React from 'react';
import { render, screen } from '@testing-library/react';
import LastDigitSelector from '../last-digit-selector';

const mocked_digit = 'Digit';

jest.mock('../digit', () => jest.fn(() => <div>{mocked_digit}</div>));

describe('LastDigitSelector', () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const mock_props = {
        digits: [],
        digit_stats: [120, 86, 105, 94, 85, 86, 124, 107, 90, 103],
    };

    it('should not render digits if digits is empty', () => {
        render(<LastDigitSelector {...mock_props} />);

        expect(screen.queryByText(mocked_digit)).not.toBeInTheDocument();
    });
    it('should render 10 digits for each digit if digits are available', () => {
        render(<LastDigitSelector {...mock_props} digits={digits} />);

        expect(screen.getAllByText(mocked_digit)).toHaveLength(10);
    });
});
