import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveLinkedToTradingAccount, useActiveWalletAccount } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import useAllBalanceSubscription from '../../../hooks/useAllBalanceSubscription';
import { ModalProvider } from '../../ModalProvider';
import { DerivAppsTradingAccount } from '../DerivAppsTradingAccount';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(() => ({
        data: {
            currency_config: { display_code: 'USD' },
            loginid: 'CRW1',
        },
        isLoading: false,
    })),
    useActiveWalletAccount: jest.fn(() => ({
        data: { currency_config: { display_code: 'USD' }, is_virtual: false, loginid: 'CRW1' },
    })),
}));

jest.mock('../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: {
            CRW1: {
                balance: 100,
                currency: 'USD',
            },
        },
        isLoading: false,
    }))
);

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockUseAllBalanceSubscription = useAllBalanceSubscription as jest.MockedFunction<
    typeof useAllBalanceSubscription
>;
const mockUseActiveLinkedToTradingAccount = useActiveLinkedToTradingAccount as jest.MockedFunction<
    typeof useActiveLinkedToTradingAccount
>;

describe('DerivAppsTradingAccount', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        jest.clearAllMocks();
    });

    it('renders the component when balance is not loading', () => {
        (mockUseActiveWalletAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        (mockUseAllBalanceSubscription as jest.Mock).mockReturnValueOnce({ isLoading: false });
        render(<DerivAppsTradingAccount />, { wrapper });
        expect(screen.getByTestId('dt_wallet_icon')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
    });
    it('renders the component when balance is loading', () => {
        (mockUseActiveWalletAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        (mockUseAllBalanceSubscription as jest.Mock).mockReturnValueOnce({ isLoading: true });
        render(<DerivAppsTradingAccount />, { wrapper });
        expect(screen.getByTestId('dt_deriv-apps-balance-loader')).toBeInTheDocument();
    });
    it('renders the component with a badge', () => {
        (mockUseDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (mockUseActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: true },
        });
        render(<DerivAppsTradingAccount />, { wrapper });
        expect(screen.getByTestId('dt_wallet_list_card_badge')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });
    it('renders the component with balance', () => {
        render(<DerivAppsTradingAccount />, { wrapper });
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
    it('navigates to /wallet/account-transfer when the transfer button is clicked', () => {
        render(<DerivAppsTradingAccount />, { wrapper });
        screen.getByTestId('dt_deriv-apps-trading-account-transfer-button').click();
        expect(mockHistoryPush).toHaveBeenCalledWith('/wallet/account-transfer', {
            toAccountLoginId: 'CRW1',
        });
    });
});
