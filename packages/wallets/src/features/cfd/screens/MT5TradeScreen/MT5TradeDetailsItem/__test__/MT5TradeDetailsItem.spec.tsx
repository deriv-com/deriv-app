import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { useModal } from '../../../../../../components/ModalProvider';
import { MT5TradeDetailsItem } from '..';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('../../../../../../components/Base', () => ({
    WalletClipboard: ({ textCopy }: { textCopy: string }) => (
        <div data-testid='dt_wallet_clipboard'>Mock Clipboard {textCopy}</div>
    ),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('MT5TradeDetailsItem', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useModal as jest.Mock).mockReturnValue({ show: jest.fn() });
    });

    it('renders clipboard variant correctly', () => {
        render(<MT5TradeDetailsItem label='Test Label' value='Test Value' />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_clipboard')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_clipboard')).toHaveTextContent('Mock Clipboard Test Value');
    });

    it('renders password variant correctly', () => {
        render(<MT5TradeDetailsItem label='Password' variant='password' />);

        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    it('renders info variant correctly', () => {
        render(<MT5TradeDetailsItem value='Info message' variant='info' />);

        expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('shows ChangePassword component when "Forgot Password?" is clicked', () => {
        const mockShow = jest.fn();
        (useModal as jest.Mock).mockReturnValue({ show: mockShow });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        render(<MT5TradeDetailsItem label='Password' variant='password' />);

        fireEvent.click(screen.getByText('Forgot Password?'));
        expect(mockShow).toHaveBeenCalled();
    });
});
