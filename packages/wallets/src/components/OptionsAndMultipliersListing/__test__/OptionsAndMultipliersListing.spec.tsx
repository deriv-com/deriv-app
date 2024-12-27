import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider, useActiveLinkedToTradingAccount, useIsEuRegion } from '@deriv/api-v2';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../ModalProvider';
import OptionsAndMultipliersListing from '../OptionsAndMultipliersListing';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(),
    useIsEuRegion: jest.fn(() => ({
        data: false,
    })),
}));

jest.mock('../../DerivAppsSection', () => ({
    DerivAppsSection: () => <div>DerivAppsSection</div>,
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
    </APIProvider>
);

describe('OptionsAndMultipliersListing', () => {
    it('should render component', () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'MX-12345' },
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        expect(screen.getByText('DerivAppsSection')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_wallets_trading_account_card')[0]).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_wallet_icon')[0]).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_label_paired_chevron')[0]).toBeInTheDocument();
    });

    it('handles onclick for the TradingAccountCard when loginid is undefined', async () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { loginid: undefined },
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        const tradingAccountCard = screen.getAllByTestId('dt_wallets_trading_account_card')[0];
        await userEvent.click(tradingAccountCard);
        expect(screen.queryByTestId('dt_label_paired_chevron')).not.toBeInTheDocument();
        expect(mockHistoryPush).not.toHaveBeenCalled();
    });

    it('handles onclick for the TradingAccountCard when loginid is defined', async () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'CR1' },
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        const tradingAccountCard = screen.getAllByTestId('dt_wallets_trading_account_card')[0];
        await userEvent.click(tradingAccountCard);
        const icon = within(tradingAccountCard).queryByTestId('dt_label_paired_chevron');
        expect(icon).toBeInTheDocument();
        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('renders the correct TradingAccountCard when the account is disabled', () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { is_disabled: true, loginid: 'CR1' },
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        const tradingAccountCard = screen.getAllByTestId('dt_wallets_trading_account_card')[0];
        expect(tradingAccountCard).toHaveAttribute('aria-disabled', 'true');
        expect(tradingAccountCard).toHaveClass('wallets-trading-account-card--disabled');
        const icon = within(tradingAccountCard).queryByTestId('dt_label_paired_chevron');
        expect(icon).toBeInTheDocument();
    });

    it('renders only accounts with availability EU when is_eu is true', () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { loginid: 'MF-1' },
        });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: true,
            isLoading: false,
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        expect(screen.getByTestId('dt_wallets_trading_account_card')).toBeInTheDocument();
        expect(screen.queryByText('Deriv Trader')).toBeInTheDocument();
        expect(screen.queryByText('Custom charts, low-entry costs.')).toBeInTheDocument();
    });
});
