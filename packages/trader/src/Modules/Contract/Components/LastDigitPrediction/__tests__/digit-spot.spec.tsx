import React from 'react';
import { screen, render } from '@testing-library/react';
import DigitSpot from '../digit-spot';

const mocked_props: React.ComponentProps<typeof DigitSpot> = {
    current_spot: '12345',
};

describe('<DigitSpot />', () => {
    it('should render current_spot value without the last digit ', () => {
        render(<DigitSpot {...mocked_props} />);
        const sliced_spot_value = screen.getByText('1234');
        expect(sliced_spot_value).toBeInTheDocument();
        expect(sliced_spot_value).toHaveClass('digits__digit-spot-value');
    });
    it('should render last digit of current_spot', () => {
        render(<DigitSpot {...mocked_props} />);
        const last_digit = screen.getByText('5');
        expect(last_digit).toBeInTheDocument();
        expect(last_digit).toHaveClass('digits__digit-spot-last');
    });
    it('should render empty elements', () => {
        mocked_props.current_spot = null;
        render(<DigitSpot {...mocked_props} />);
        expect(screen.getByTestId('dt_digits_digit_spot_value')).toBeEmptyDOMElement();
        expect(screen.getByTestId('dt_digits_digit_spot_last')).toBeEmptyDOMElement();
    });
});
