import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CFDPasswordModalTnc, { type TCFDPasswordModalTncProps } from '../CFDPasswordModalTnc';

jest.mock('@deriv-com/ui', () => ({
    Checkbox: jest.fn(({ checked, label, onChange }) => (
        <div>
            <input checked={checked} data-testid='dt_wallets_tnc_checkbox' onChange={onChange} type='checkbox' />
            <label>{label}</label>
        </div>
    )),
    InlineMessage: jest.fn(({ children }) => <div data-testid='dt_wallets_tnc_inline_message'>{children}</div>),
    Text: jest.fn(({ children }) => <div data-testid='dt_wallets_tnc_text'>{children}</div>),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(() => ({
        getModalState: jest.fn(() => 'bvi'),
    })),
}));

jest.mock('../../../../../components/Base/WalletLink', () => ({
    WalletLink: ({ children }: { children: React.ReactNode }) => <a href='https://example.com'>{children}</a>,
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
        expect(screen.getByTestId('dt_wallets_tnc_checkbox')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_tnc_inline_message')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        expect(screen.getByText(/You are adding your Deriv MT5/i)).toBeInTheDocument();
        expect(screen.getByText(/I confirm and accept/i)).toBeInTheDocument();
    });

    it('handles checkbox change', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        const checkbox = screen.getByTestId('dt_wallets_tnc_checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('renders the terms and conditions link', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        const link = screen.getByText('terms and conditions');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('uses the correct platform and product titles', () => {
        render(<CFDPasswordModalTnc {...defaultProps} />);
        expect(screen.getByText(/MT5.*Zero Spread/)).toBeInTheDocument();
    });
});
