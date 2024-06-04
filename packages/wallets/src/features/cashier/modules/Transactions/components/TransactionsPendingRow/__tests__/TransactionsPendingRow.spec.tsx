import React from 'react';
import { useCancelCryptoTransaction } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../../../components/ModalProvider';
import useDevice from '../../../../../../../hooks/useDevice';
import TransactionsCryptoRow from '../TransactionsPendingRow';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            is_virtual: false,
        },
    })),
    useCancelCryptoTransaction: jest.fn(() => ({ mutate: jest.fn() })),
}));

jest.mock('moment', () => ({
    unix: jest.fn(() => ({
        format: jest.fn(),
        utc: jest.fn(() => ({
            format: jest.fn(),
        })),
    })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(() => '?modal-open=true'),
    }),
}));

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

const mockWithdrawal = {
    address_hash: '',
    address_url: '',
    amount: 0.0002,
    description: '',
    formatted_address_hash: '',
    formatted_amount: '',
    formatted_confirmations: 'Pending',
    formatted_transaction_hash: 'Pending',
    id: '0123',
    is_deposit: false,
    is_valid_to_cancel: 1 as const,
    is_withdrawal: true,
    status_code: 'LOCKED' as const,
    status_message: '',
    status_name: '',
    submit_date: 123456,
    transaction_type: 'withdrawal' as const,
};

const mockDeposit = {
    ...mockWithdrawal,
    is_deposit: true,
    is_withdrawal: false,
    transaction_url: 'https://test.com',
};

describe('TransactionsPendingRow', () => {
    let $root: HTMLDivElement, $modalContainer: HTMLDivElement;

    beforeEach(() => {
        jest.clearAllMocks();
        $root = document.createElement('div');
        $root.id = 'root';
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($root);
        document.body.appendChild($modalContainer);
    });

    afterEach(() => {
        document.body.removeChild($root);
        document.body.removeChild($modalContainer);
    });

    it('should render component with correct contents for withdrawal on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>
        );

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render component with correct contents for deposit on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockDeposit} />
            </ModalProvider>
        );

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
        expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('should render component with correct contents for withdrawal for mobile/responsive', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>
        );

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should render component with correct contents for deposit on mobile/responsive', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockDeposit} />
            </ModalProvider>
        );

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('should show modal on click of cancel button in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel transaction'));
        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();
    });

    it('should cancel transaction on click of cancel confirmation button in modal', () => {
        const mockMutate = jest.fn();
        (useCancelCryptoTransaction as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel transaction'));
        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Yes, cancel'));
        expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
        expect(mockMutate).toHaveBeenCalledWith({ payload: { id: '0123' } });
    });

    it('should not cancel transaction on click of cancel deny button in modal', () => {
        const mockMutate = jest.fn();
        (useCancelCryptoTransaction as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel transaction'));
        expect(screen.getByText('Are you sure you want to cancel this transaction?')).toBeInTheDocument();

        fireEvent.click(screen.getByText("No, don't cancel"));
        expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
        expect(mockMutate).not.toHaveBeenCalledWith({ payload: { id: '0123' } });
    });

    it('should show transaction details modal on click of transaction status button in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByTestId('dt_transaction_status_button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_transaction_status_button'));
        expect(screen.getByText('Transaction details')).toBeInTheDocument();
    });

    it('should close modal on click of Ok button in transaction details modal', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>,
            { container: $root }
        );

        expect(screen.getByTestId('dt_transaction_status_button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_transaction_status_button'));
        expect(screen.getByText('Transaction details')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Ok'));
        expect(screen.queryByText('Transaction details')).not.toBeInTheDocument();
    });

    it('should not show modal on click of transaction status button in desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(
            <ModalProvider>
                <TransactionsCryptoRow transaction={mockWithdrawal} />
            </ModalProvider>
        );

        expect(screen.getByTestId('dt_transaction_status_button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_transaction_status_button'));
        expect(screen.queryByText('Are you sure you want to cancel this transaction?')).not.toBeInTheDocument();
    });
});
