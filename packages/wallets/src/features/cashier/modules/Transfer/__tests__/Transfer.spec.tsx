import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransferProvider, useTransfer } from '../provider';
import TransferModule from '../Transfer';

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferForm: jest.fn(() => <div>TransferForm</div>),
    TransferReceipt: jest.fn(() => <div>TransferReceipt</div>),
}));

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <TransferProvider>{children}</TransferProvider>;

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    TransferProvider: jest.fn(({ children }) => <div>{children}</div>),
    useTransfer: jest.fn(),
}));

const mockResetTransfer = jest.fn();

describe('Transfer', () => {
    beforeEach(() => {
        (useTransfer as jest.Mock).mockReturnValue({
            error: null,
            receipt: undefined,
            resetTransfer: mockResetTransfer,
        });
    });

    it('should render the TransferForm', () => {
        render(<TransferModule accounts={[]} />, { wrapper });

        expect(screen.getByText('TransferForm')).toBeInTheDocument();
    });

    it('should render the TransferReceipt', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            error: null,
            receipt: {},
            resetTransfer: mockResetTransfer,
        });
        render(<TransferModule accounts={[]} />, { wrapper });

        expect(screen.getByText('TransferReceipt')).toBeInTheDocument();
    });

    it('should render the error screen when error is received', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            error: { error: { code: 'Error', message: 'Error message' } },
            receipt: undefined,
            resetTransfer: mockResetTransfer,
        });
        render(<TransferModule accounts={[]} />, { wrapper });

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset error' })).toBeInTheDocument();
    });

    it('should call reset transfer when reset error button is clicked', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            error: { error: { code: 'Error', message: 'Error message' } },
            receipt: undefined,
            resetTransfer: mockResetTransfer,
        });
        render(<TransferModule accounts={[]} />, { wrapper });

        const resetErrorButton = screen.getByRole('button', { name: 'Reset error' });
        expect(resetErrorButton).toBeInTheDocument();
        userEvent.click(resetErrorButton);
        expect(mockResetTransfer).toBeCalled();
    });

    it('should render the correct error screen when transfer between accounts error is received', () => {
        (useTransfer as jest.Mock).mockReturnValue({
            error: { error: { code: 'TransferBetweenAccountsError', message: 'Transfer Between Accounts Error' } },
            receipt: undefined,
            resetTransfer: mockResetTransfer,
        });
        render(<TransferModule accounts={[]} />, { wrapper });

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Transfer Between Accounts Error')).toBeInTheDocument();
        expect(screen.queryByText('Reset error')).not.toBeInTheDocument();
    });
});
