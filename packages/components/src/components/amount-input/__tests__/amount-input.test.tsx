import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmountInput from '../amount-input';

describe('<AmountInput/>', () => {
    it('should render with the initial value of "0.00"', () => {
        render(<AmountInput currency='USD' max_digits={8} />);
        const input = screen.getByTestId('dt_amount-input');
        expect(input).toHaveDisplayValue('0.00');
    });

    it('should not change the value on non-numeric and non-"." inputs', () => {
        render(<AmountInput currency='USD' max_digits={8} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, 'abcdef!@#$%^&*()_+-={}[];\'"|\\/,.<>');
        expect(input).toHaveDisplayValue('0.00');
    });

    it('should change the value like an ATM, i.e. from right to left, when entering digits', () => {
        render(<AmountInput currency='USD' max_digits={8} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '1');
        expect(input).toHaveDisplayValue('0.01');
        userEvent.type(input, '2');
        expect(input).toHaveDisplayValue('0.12');
        userEvent.type(input, '3');
        expect(input).toHaveDisplayValue('1.23');
    });

    it('should add commas for big values', () => {
        render(<AmountInput currency='USD' max_digits={8} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '12345678');
        expect(input).toHaveDisplayValue('123,456.78');
    });

    it('should not remove "0.00" when backspacing', () => {
        render(<AmountInput currency='USD' max_digits={8} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '100');
        expect(input).toHaveDisplayValue('1.00');
        userEvent.clear(input);
        expect(input).toHaveDisplayValue('0.00');
    });

    it('should not accept more than {maxDigits} digits', () => {
        render(<AmountInput currency='USD' max_digits={9} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '1234567890987654321');
        expect(input).toHaveDisplayValue('1,234,567.89');
    });

    it('should work correctly with explicitly set {decimal_points}', () => {
        render(<AmountInput currency='USD' decimal_places={5} />);
        const input = screen.getByTestId('dt_amount-input');
        expect(input).toHaveDisplayValue('0.00000');
        userEvent.type(input, '12345678');
        expect(input).toHaveDisplayValue('123.45678');
    });
});
