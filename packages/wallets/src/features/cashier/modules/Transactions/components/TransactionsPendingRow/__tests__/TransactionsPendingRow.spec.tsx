import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../hooks/useDevice';
import TransactionsCryptoRow from '../TransactionsPendingRow';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: () => ({
        data: {
            is_virtual: false,
        },
    }),
    useCancelCryptoTransaction: () => ({
        mutate: jest.fn(),
    }),
}));

const mockHide = jest.fn();
const mockShow = jest.fn();
jest.mock('../../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../../components/ModalProvider'),
    useModal: () => ({
        hide: mockHide,
        show: mockShow,
    }),
}));

jest.mock('moment', () => ({
    unix: jest.fn(() => ({
        format: jest.fn(),
        utc: jest.fn(() => ({
            format: jest.fn(),
        })),
    })),
}));

jest.mock('usehooks-ts', () => ({
    useHover: jest.fn(() => false),
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

describe('TransactionsPendingRow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render component with correct contents for withdrawal on desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<TransactionsCryptoRow transaction={mockWithdrawal} />);

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText('Confirmations')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
    });

    it('should render component with correct content for mobile/responsive', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<TransactionsCryptoRow transaction={mockWithdrawal} />);

        expect(screen.getByText('Transaction hash')).toBeInTheDocument();
        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText('Confirmations')).toBeInTheDocument();
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument();
    });

    it('should show modal on click of cancel button in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<TransactionsCryptoRow transaction={mockWithdrawal} />);

        expect(screen.getByText('Cancel transaction')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancel transaction'));

        expect(mockShow).toHaveBeenCalled();
    });

    it('should show modal on click of transaction status button in mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<TransactionsCryptoRow transaction={mockWithdrawal} />);

        expect(screen.getByTestId('dt_transaction_status_button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_transaction_status_button'));

        expect(mockShow).toHaveBeenCalled();
    });

    it('should not show modal on click of transaction status button in desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<TransactionsCryptoRow transaction={mockWithdrawal} />);

        expect(screen.getByTestId('dt_transaction_status_button')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_transaction_status_button'));

        expect(mockShow).not.toHaveBeenCalled();
    });
});
