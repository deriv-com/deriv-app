import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmountInput from '../amount-input';

describe('<AmountInput/>', () => {
    it('should render with the initial value of "0.00" if {initial_value} is not specified', () => {
        render(<AmountInput currency='USD' />);
        const input = screen.getByTestId('dt_amount-input');
        expect(input).toHaveDisplayValue('0.00');
    });

    it('should render with the correct initial value if {initial_value} was supplied', () => {
        render(<AmountInput currency='USD' initial_value={42} />);
        const input = screen.getByTestId('dt_amount-input');
        expect(input).toHaveDisplayValue('42.00');
    });

    it('should not change the value on non-numeric and non-"." inputs', () => {
        render(<AmountInput currency='USD' />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, 'abcdef!@#$%^&*()_+-={}[];\'"|\\/,.<>');
        expect(input).toHaveDisplayValue('0.00');
    });

    it('should change the value like an ATM, i.e. from right to left, when entering digits', () => {
        render(<AmountInput currency='USD' />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '1');
        expect(input).toHaveDisplayValue('0.01');
        userEvent.type(input, '2');
        expect(input).toHaveDisplayValue('0.12');
        userEvent.type(input, '3');
        expect(input).toHaveDisplayValue('1.23');
    });

    it('should add commas for big values', () => {
        render(<AmountInput currency='USD' max_digits={9} />);
        const input = screen.getByTestId('dt_amount-input');
        userEvent.type(input, '123456789');
        expect(input).toHaveDisplayValue('1,234,567.89');
    });

    it('should not remove "0.00" when backspacing', () => {
        render(<AmountInput currency='USD' />);
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

    it('should allow pasting numbers and then interpret those correctly', () => {
        render(<AmountInput currency='USD' />);
        const input = screen.getByTestId('dt_amount-input');
        const values = [
            ['123', '123.00'],
            ['123.42', '123.42'],
            ['123,42', '123.42'],
            ['123,000.00', '123,000.00'],
        ];
        values.forEach(pair => {
            userEvent.clear(input);
            userEvent.click(input);
            userEvent.paste(input, pair[0]);
            expect(input).toHaveDisplayValue(pair[1]);
        });
    });
});
