import React from 'react';
import { render, screen } from '@testing-library/react';
import Money from '../money';

describe('Money', () => {
    it('should have the "className" when passed in', () => {
        render(<Money className='test-class' />);
        expect(screen.getByTestId('dt_span')).toHaveClass('test-class');
    });

    it('should return correct text based on the props when "amount" is > 0 and "has_sign" is "true"', () => {
        render(<Money has_sign amount={+10} />);
        expect(screen.getByText('+')).toBeInTheDocument();
        expect(screen.getByText('10.00')).toBeInTheDocument();
    });

    it('should return correct text based on the props when "amount" is < 0 and "has_sign" is "true"', () => {
        render(<Money has_sign amount={-10} />);
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText('10.00')).toBeInTheDocument();
    });

    it('should return correct text based on the props when "amount" is 0 and "has_sign" is "true"', () => {
        render(<Money has_sign amount={0} />);
        expect(screen.getByText('0.00')).toBeInTheDocument();
    });

    it('should return correct text based on the props when "amount" is > 0 and "has_sign" is "true" and "should_format" is "false")', () => {
        render(<Money has_sign amount={+10} should_format={false} />);
        expect(screen.getByText('+')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should return correct text based on the props when "amount" is < 0 and "has_sign" is "true" and "should_format" is "false"', () => {
        render(<Money has_sign amount={-10.5} should_format={false} />);
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText('10.5')).toBeInTheDocument();
    });

    it('should return correct text based on the props when "amount" is 0 and "has_sign" is "true" and "should_format" is "false"', () => {
        render(<Money has_sign should_format={false} amount={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should show the currency when "show_currency" passed', () => {
        render(<Money amount={0} show_currency />);
        expect(screen.getByText('0.00 USD')).toBeInTheDocument();
    });
});
