import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import OneTimeDepositModal from '../one-time-deposit-modal';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCurrentCurrencyConfig: jest.fn(() => ({ is_crypto: false })),
    useCryptoTransactions: jest.fn(() => ({ data: [], has_transactions: false })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

type TModal = React.FC<{
    children: React.ReactNode;
}> & {
    Body?: React.FC<{
        children: React.ReactNode;
    }>;
    Footer?: React.FC<{
        children: React.ReactNode;
    }>;
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    const Modal: TModal = jest.fn(() => {
        return (
            <div>
                <h1>Modal</h1>
            </div>
        );
    });
    Modal.Body = jest.fn(() => <div>Body</div>);
    Modal.Footer = jest.fn(() => <div>Footer</div>);

    const MobileFullPageModal = jest.fn(() => <div>MobileFullPageModal</div>);

    return {
        ...original_module,
        Modal,
        MobileFullPageModal,
    };
});

jest.mock('../one-time-deposit-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    OneTimeDepositModalContent: () => <div>Content</div>,
}));

jest.mock('../../Modals/deposit-now-or-later-modal', () => jest.fn(() => <div>DepositNowOrLater</div>));
jest.mock('../../Modals/crypto-transaction-processing-modal', () => jest.fn(() => <div>Crypto</div>));

describe('<OneTimeDepositModal />', () => {
    const setIsAccountDeposited = jest.fn();
    const setShouldShowOneTimeDepositModal = jest.fn();
    const setShouldShowCryptoTransactionProcessingModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            setShouldShowOneTimeDepositModal,
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

    it('should render one time deposit modal for desktop', () => {
        render(<OneTimeDepositModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/Modal/)).toBeInTheDocument();
    });

    it('should render one time deposit modal for responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByText(/MobileFullPageModal/)).toBeInTheDocument();
    });

    it('should set is_account_deposited to true if balance more than 0', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        (mockUseState as jest.Mock).mockImplementation(initial_value => [initial_value, setIsAccountDeposited]);

        const mock = mockStore({ client: { balance: 10 } });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(mock),
        });

        expect(setIsAccountDeposited).toHaveBeenCalledWith(true);
    });

    it('should set is_account_deposited to true if is_cr_account && currency_config?.is_crypto && crypto_transactions && has_transactions', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        (mockUseState as jest.Mock).mockImplementation(initial_value => [initial_value, setIsAccountDeposited]);

        (useCryptoTransactions as jest.Mock).mockReturnValueOnce({
            data: [{ transaction_type: 'deposit', status_code: 'SUCCESS', is_deposit: true }],
            has_transactions: true,
        });
        (useCurrentCurrencyConfig as jest.Mock).mockReturnValueOnce({
            is_crypto: true,
        });

        const mock = mockStore({
            client: { is_logged_in: true, is_cr_account: true },
            ui: {
                setShouldShowOneTimeDepositModal,
                setShouldShowCryptoTransactionProcessingModal,
            },
        });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper({ ...mockDefault, ...mock }),
        });

        expect(setIsAccountDeposited).toHaveBeenCalledWith(true);
        expect(setShouldShowOneTimeDepositModal).toHaveBeenCalledTimes(0);
        expect(setShouldShowCryptoTransactionProcessingModal).toHaveBeenCalledTimes(0);
    });

    it('should open show-crypto-transaction-processing-modal and close current modal', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        (mockUseState as jest.Mock).mockImplementation(initial_value => [initial_value, setIsAccountDeposited]);

        (useCryptoTransactions as jest.Mock).mockReturnValueOnce({
            data: [{ transaction_type: 'deposit', status_code: 'PENDING', is_deposit: true }],
            has_transactions: true,
        });
        (useCurrentCurrencyConfig as jest.Mock).mockReturnValueOnce({
            is_crypto: true,
        });

        const mock = mockStore({
            client: { is_logged_in: true, is_cr_account: true },
            ui: {
                setShouldShowOneTimeDepositModal,
                setShouldShowCryptoTransactionProcessingModal,
            },
        });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(mock),
        });

        expect(setIsAccountDeposited).toHaveBeenCalledWith(true);
        expect(setShouldShowOneTimeDepositModal).toHaveBeenCalledWith(false);
        expect(setShouldShowCryptoTransactionProcessingModal).toHaveBeenCalledWith(true);
    });
});
