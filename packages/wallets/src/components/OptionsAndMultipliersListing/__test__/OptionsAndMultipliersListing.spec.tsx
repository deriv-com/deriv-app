import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider, useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
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

    it('should change TradingAccountCard if loginid is undefined', () => {
        (useActiveLinkedToTradingAccount as jest.Mock).mockReturnValue({
            data: { loginid: undefined },
        });
        render(<OptionsAndMultipliersListing />, { wrapper });
        const tradingAccountCard = screen.getAllByTestId('dt_wallets_trading_account_card')[0];
        expect(tradingAccountCard).toHaveAttribute('aria-disabled', 'true');
        expect(tradingAccountCard).toHaveClass('wallets-trading-account-card--disabled');
        expect(screen.queryByTestId('dt_label_paired_chevron')).not.toBeInTheDocument();
    });
});
