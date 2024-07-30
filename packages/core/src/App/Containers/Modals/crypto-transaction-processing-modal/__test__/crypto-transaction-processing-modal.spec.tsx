import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import CryptoTransactionProcessingModal from '../crypto-transaction-processing-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../crypto-transaction-processing-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    CryptoTransactionProcessingModalContent: () => <div>Content</div>,
}));

describe('<CryptoTransactionProcessingModal />', () => {
    let modal_root_el: HTMLDivElement;

    const setShouldShowCryptoTransactionProcessingModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            should_show_crypto_transaction_processing_modal: true,
            setShouldShowCryptoTransactionProcessingModal,
        },
    });

    const wrapper = (mock: ReturnType<typeof mockStore> = mockDefault) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        modal_root_el.setAttribute('data-testid', 'dt_test_modal');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render modal for desktop', () => {
        render(<CryptoTransactionProcessingModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render modal for responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        render(<CryptoTransactionProcessingModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should call setShouldShowCryptoTransactionProcessingModal with false when try to close modal', () => {
        render(<CryptoTransactionProcessingModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button', {
            name: '',
        });
        userEvent.click(close_button);

        expect(setShouldShowCryptoTransactionProcessingModal).toHaveBeenCalledWith(false);
    });
});
