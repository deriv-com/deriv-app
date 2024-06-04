import React from 'react';
import { act } from 'react-dom/test-utils';
import { useCancelCryptoTransaction } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../../../components/ModalProvider';
import CryptoTransaction from '../CryptoTransaction';

jest.mock('@deriv/api-v2', () => ({
    useCancelCryptoTransaction: jest.fn(),
}));

const mockModalHide = jest.fn();
jest.mock('../../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../../../components/ModalProvider').useModal(),
        hide: mockModalHide,
    })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

const mockTransaction = {
    address_hash: '',
    address_url: '',
    amount: 0.0002,
    description: '',
    formatted_address_hash: '',
    formatted_amount: '',
    formatted_confirmations: 'Pending',
    formatted_transaction_hash: 'Pending',
    id: '',
    is_deposit: false,
    is_valid_to_cancel: 1 as const,
    is_withdrawal: true,
    status_code: 'LOCKED' as const,
    status_message: '',
    status_name: '',
    submit_date: 123456,
    transaction_type: 'withdrawal' as const,
};

describe('CryptoTransaction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render component with default properties', () => {
        (useCancelCryptoTransaction as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(
            <ModalProvider>
                <CryptoTransaction currencyDisplayCode='BTC' transaction={mockTransaction} />
            </ModalProvider>
        );

        expect(screen.getByText('Withdrawal BTC')).toBeInTheDocument();
        expect(screen.getByText(/Pending/)).toBeInTheDocument();
        expect(screen.queryByText(/Confirmations/)).not.toBeInTheDocument();
    });

    it('should render component with correct properties for deposit type transaction', () => {
        const mockDepositTransaction = {
            address_hash: '',
            address_url: '',
            amount: 0.0002,
            description: '',
            formatted_address_hash: '',
            formatted_amount: '',
            formatted_confirmations: 'Pending',
            formatted_transaction_hash: 'Pending',
            id: '',
            is_deposit: true,
            is_valid_to_cancel: 1 as const,
            is_withdrawal: false,
            status_code: 'LOCKED' as const,
            status_message: '',
            status_name: '',
            submit_date: 123456,
            transaction_type: 'withdrawal' as const,
        };
        (useCancelCryptoTransaction as jest.Mock).mockReturnValue({ mutate: jest.fn() });

        render(
            <ModalProvider>
                <CryptoTransaction currencyDisplayCode='BTC' transaction={mockDepositTransaction} />
            </ModalProvider>
        );

        expect(screen.getByText('Deposit BTC')).toBeInTheDocument();
        expect(screen.getByText(/Confirmations/)).toBeInTheDocument();
        expect(screen.getAllByText(/Pending/)[1]).toBeInTheDocument();
    });

    it('should open modal when cancel button is clicked', async () => {
        const mutateMock = jest.fn();

        (useCancelCryptoTransaction as jest.Mock).mockReturnValue({ mutate: mutateMock });
        document.body.innerHTML = `<div id='wallets_modal_root' />`;

        render(
            <ModalProvider>
                <CryptoTransaction currencyDisplayCode='BTC' transaction={mockTransaction} />
            </ModalProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByTestId('dt-wallets-crypto-transactions-cancel-button'));
        });

        expect(screen.getByText("No, don't cancel")).toBeInTheDocument();
        expect(screen.getByText('Yes, cancel')).toBeInTheDocument();
    });

    it('should close modal when cancel negation button is clicked', async () => {
        const mutateMock = jest.fn();

        (useCancelCryptoTransaction as jest.Mock).mockReturnValue({ mutate: mutateMock });
        document.body.innerHTML = `<div id='wallets_modal_root' />`;

        render(
            <ModalProvider>
                <CryptoTransaction currencyDisplayCode='BTC' transaction={mockTransaction} />
            </ModalProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByTestId('dt-wallets-crypto-transactions-cancel-button'));
        });

        expect(screen.getByText("No, don't cancel")).toBeInTheDocument();
        expect(screen.getByText('Yes, cancel')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: "No, don't cancel" }));

        expect(mockModalHide).toHaveBeenCalled();
    });

    it('should cancel transaction when cancel confirmation button is clicked', async () => {
        const mutateMock = jest.fn();

        (useCancelCryptoTransaction as jest.Mock).mockReturnValue({ mutate: mutateMock });
        document.body.innerHTML = `<div id='wallets_modal_root' />`;

        render(
            <ModalProvider>
                <CryptoTransaction currencyDisplayCode='BTC' transaction={mockTransaction} />
            </ModalProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByTestId('dt-wallets-crypto-transactions-cancel-button'));
        });

        expect(screen.getByText("No, don't cancel")).toBeInTheDocument();
        expect(screen.getByText('Yes, cancel')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Yes, cancel' }));

        expect(mutateMock).toHaveBeenCalled();
        const [[mutationPayload]] = mutateMock.mock.calls;
        expect(mutationPayload).toEqual({ payload: { id: mockTransaction.id } });
    });
});
