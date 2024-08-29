import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { StoreProvider, mockStore } from '@deriv/stores';
import OneTimeDepositModal from '../one-time-deposit-modal';
import { useCryptoTransactions, useCurrentCurrencyConfig } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCurrentCurrencyConfig: jest.fn(() => ({ platform: { cashier: ['doughflow'] } })),
    useCryptoTransactions: jest.fn(() => ({ data: [], has_transactions: false })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../one-time-deposit-modal-content', () => ({
    __esModule: true,
    default: () => undefined,
    OneTimeDepositModalContent: () => <div>Content</div>,
}));

jest.mock('../../Modals/deposit-now-or-later-modal', () => jest.fn(() => <div>DepositNowOrLater</div>));
jest.mock('../../Modals/crypto-transaction-processing-modal', () => jest.fn(() => <div>Crypto</div>));

describe('<OneTimeDepositModal />', () => {
    let modal_root_el: HTMLDivElement;

    const setIsAccountDeposited = jest.fn();
    const setShouldShowOneTimeDepositModal = jest.fn();
    const setShouldShowCryptoTransactionProcessingModal = jest.fn();
    const setShouldShowDepositNowOrLaterModal = jest.fn();

    const mockDefault = mockStore({
        ui: {
            should_show_one_time_deposit_modal: true,
            setShouldShowOneTimeDepositModal,
            setShouldShowCryptoTransactionProcessingModal,
            setShouldShowDepositNowOrLaterModal,
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
        jest.spyOn(React, 'useState').mockRestore();
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

    it('should render one time deposit modal for desktop', () => {
        render(<OneTimeDepositModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render one time deposit modal for responsive', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(),
        });

        expect(screen.getByTestId('dt_test_modal')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
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

        (useCryptoTransactions as jest.Mock).mockReturnValue({
            data: [{ transaction_type: 'deposit', status_code: 'SUCCESS', is_deposit: true }],
            has_transactions: true,
        });
        (useCurrentCurrencyConfig as jest.Mock).mockReturnValueOnce({
            platform: { cashier: ['crypto'] },
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
            platform: { cashier: ['crypto'] },
        });

        const mock = mockStore({
            client: { is_logged_in: true },
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

    it('should call setShouldShowDepositNowOrLaterModal with true if is_account_deposited = false, when try to close modal', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        (mockUseState as jest.Mock).mockImplementation(initial_value => [initial_value, setIsAccountDeposited]);

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(),
        });

        const close_button = screen.getByRole('button');

        userEvent.click(close_button);

        expect(setShouldShowDepositNowOrLaterModal).toHaveBeenCalledWith(true);
    });

    it('should call setShouldShowOneTimeDepositModal with false if is_account_deposited = true, when try to close modal', async () => {
        const mock = mockStore({
            client: { balance: 10 },
            ui: {
                should_show_one_time_deposit_modal: true,
                setShouldShowOneTimeDepositModal,
            },
        });

        render(<OneTimeDepositModal />, {
            wrapper: wrapper(mock),
        });

        const close_button = screen.getByRole('button');
        userEvent.click(close_button);

        expect(setShouldShowOneTimeDepositModal).toHaveBeenCalledWith(false);
    });
});
