import React from 'react';
import { screen, render } from '@testing-library/react';
import LastDigitPrediction from '../last-digit-prediction';

jest.mock('../digit-display', () => jest.fn(() => <div>mockedDigitDisplay</div>));
jest.mock('../last-digit-pointer', () => jest.fn(() => 'mockedLastDigitPointer'));

const mocked_props = {
    barrier: 1,
    digits: [0, 2, 3, 4, 5],
    digits_info: {
        '1544707344': {
            digit: 6,
            spot: '123.456',
        },
    },
    dimension: 52,
    is_digit_contract: true,
    has_entry_spot: true,
    is_ended: false,
    is_trade_page: true,
    onDigitChange: jest.fn(),
    onLastDigitSpot: jest.fn(),
    selected_digit: 1,
    tick: {
        pip_size: 2,
        quote: 102.23,
    },
};
describe('<LastDigitPrediction />', () => {
    it('should render 10 mockedDigitDisplay that represent numbers 0 - 9', () => {
        render(<LastDigitPrediction {...mocked_props} />);
        expect(screen.getAllByText(/mockedDigitDisplay/i)).toHaveLength(10);
    });
    it('should render last digit pointer', () => {
        render(<LastDigitPrediction {...mocked_props} />);
        expect(screen.getByText(/mockedlastdigitpointer/i)).toBeInTheDocument();
    });
});
