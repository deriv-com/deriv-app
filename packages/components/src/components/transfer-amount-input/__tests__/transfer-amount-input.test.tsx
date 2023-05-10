import React from 'react';
import { render, screen } from '@testing-library/react';
import TransferAmountInput from '../transfer-amount-input';

describe('<TransferAmountInput/>', () => {
    it('should render with the initial value of "0.00"', () => {
        render(<TransferAmountInput currency={'USD'} />);
    });

    it('should not change the value on non-numeric and non-"." inputs', () => {
        render(<TransferAmountInput currency={'USD'} />);
    });

    it('should change the value like an ATM, i.e. from right to left, when entering digits', () => {
        render(<TransferAmountInput currency={'USD'} />);
    });

    it('should add commas for big values', () => {
        render(<TransferAmountInput currency={'USD'} />);
    });

    it('should not remove "0.00" when backspacing', () => {
        render(<TransferAmountInput currency={'USD'} />);
    });
});
