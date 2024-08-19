import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CFDPasswordModalTnc, { type TCFDPasswordModalTncProps } from '../CFDPasswordModalTnc';

jest.mock('@deriv-com/ui', () => ({
    Checkbox: jest.fn(({ checked, label, onChange }) => (
        <div>
            <input checked={checked} data-testid='checkbox' onChange={onChange} type='checkbox' />
            <label>{label}</label>
        </div>
    )),
    InlineMessage: jest.fn(({ children }) => <div data-testid='inline-message'>{children}</div>),
}));

jest.mock('@deriv-com/utils', () => ({
    URLUtils: {
        getDerivStaticURL: jest.fn(() => 'https://example.com/tnc'),
    },
}));

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(() => ({
        getModalState: jest.fn(() => 'bvi'),
    })),
}));

const mockOnChange = jest.fn();

describe('CFDPasswordModalTnc', () => {
    const defaultProps: TCFDPasswordModalTncProps = {
        checked: false,
        onChange: mockOnChange,
        platform: 'mt5',
        product: 'zero_spread',
    };

    it('renders correctly', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        expect(screen.getByTestId('checkbox')).toBeInTheDocument();
        expect(screen.getByTestId('inline-message')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        expect(screen.getByText(/You are adding your Deriv MT5/i)).toBeInTheDocument();
        expect(screen.getByText(/I confirm and accept/i)).toBeInTheDocument();
    });

    it('handles checkbox change', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        const checkbox = screen.getByTestId('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('renders the terms and conditions link', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        const link = screen.getByText('terms and conditions');
        expect(link).toHaveAttribute('href', 'https://example.com/tnc');
        expect(link).toHaveAttribute('rel', 'noreferrer');
    });

    it('uses the correct platform and product titles', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        expect(screen.getByText(/MT5.*Zero Spread/)).toBeInTheDocument();
    });
});
