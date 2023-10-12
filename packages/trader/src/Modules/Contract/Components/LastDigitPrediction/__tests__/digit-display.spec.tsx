import React from 'react';
import { screen, render } from '@testing-library/react';
import DigitDisplay from '../digit-display';

jest.mock('../last-digit-stat', () => jest.fn(() => 'mockedLastDigitStat'));
jest.mock('../digit', () => jest.fn(() => <div>mockedDigit</div>));
jest.mock('../digit-spot', () => jest.fn(() => 'mockedDigitSpot'));

const mocked_props: React.ComponentProps<typeof DigitDisplay> = {
    barrier: 1,
    is_digit_contract: true,
    has_entry_spot: true,
    is_lost: false,
    is_max: true,
    is_min: true,
    is_won: false,
    onSelect: jest.fn(),
    latest_digit: {
        digit: 2,
        spot: '123.456',
    },
    selected_digit: 2,
    status: 'open',
    value: 2,
};

describe('<DigitDisplay />', () => {
    const mocked_last_digit_stat = 'mockedLastDigitStat';
    const mocked_digit_spot = 'mockedDigitSpot';

    it('should render mockedLastDigitStat, mockedDigitSpot and mockedDigit', () => {
        render(<DigitDisplay {...mocked_props} />);
        expect(screen.getByText(mocked_last_digit_stat)).toBeInTheDocument();
        expect(screen.getByText(mocked_digit_spot)).toBeInTheDocument();
        expect(screen.getByText('mockedDigit')).toBeInTheDocument();
    });
    it('mockedLastDigitStat and mockedDigitSpot should have their respective classnames', () => {
        render(<DigitDisplay {...mocked_props} />);
        expect(screen.getByText(mocked_last_digit_stat)).toHaveClass('digits__digit--latest');
        expect(screen.getByText(mocked_digit_spot)).toHaveClass('digits__digit-spot');
    });
});
