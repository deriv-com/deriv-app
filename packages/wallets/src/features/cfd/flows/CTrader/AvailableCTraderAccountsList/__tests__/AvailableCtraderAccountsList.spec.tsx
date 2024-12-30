import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {
    useActiveWalletAccount,
    useCreateOtherCFDAccount,
    useIsHubRedirectionEnabled,
    useSettings,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../../components/ModalProvider';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import AvailableCTraderAccountsList from '../AvailableCTraderAccountsList';

jest.mock('@deriv/api-v2');
jest.mock('../../../../../../hooks/useIsRtl');

jest.mock('../../../../modals/CTraderSuccessModal', () => ({
    CTraderSuccessModal: jest.fn(() => <div data-testid='dt_ctrader_success_modal' />),
}));

jest.mock('../../../../../../components', () => ({
    ...jest.requireActual('../../../../../../components'),
    WalletError: jest.fn(({ errorMessage, onClick, title }) => (
        <div data-testid='dt_wallet_error'>
            <div>{title}</div>
            <div>{errorMessage}</div>
            <button onClick={onClick}>Try again</button>
        </div>
    )),
}));

describe('AvailableCTraderAccountsList', () => {
    let $modalContainer: HTMLDivElement;
    const history = createMemoryHistory();

    beforeEach(() => {
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($modalContainer);

        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: false, wallet_currency_type: 'USD' },
        });
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: false,
            mutate: jest.fn(),
            status: 'idle',
        });
        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: false,
        });
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                trading_hub: 0,
            },
        });
        (useIsRtl as jest.Mock).mockReturnValue(false);
    });

    afterEach(() => {
        document.body.removeChild($modalContainer);
        jest.clearAllMocks();
    });

    it('renders default content of available ctrader accounts list', () => {
        (useIsRtl as jest.Mock).mockReturnValue(true);
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: true },
        });

        render(
            <ModalProvider>
                <AvailableCTraderAccountsList />
            </ModalProvider>
        );

        expect(screen.getByText('Deriv cTrader')).toBeInTheDocument();
        expect(screen.getByText('CFDs on financial and derived instruments with copy trading.')).toBeInTheDocument();
    });

    it('calls mutate function when card is clicked', () => {
        const mutateMock = jest.fn();
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: false,
            mutate: mutateMock,
            status: 'idle',
        });

        render(
            <ModalProvider>
                <AvailableCTraderAccountsList />
            </ModalProvider>
        );
        userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        expect(mutateMock).toHaveBeenCalledWith({
            payload: {
                account_type: 'real',
                market_type: 'all',
                platform: 'ctrader',
            },
        });
    });

    it('shows success modal when account creation is successful', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            data: { login: '12345' },
            isLoading: false,
            isSuccess: true,
            mutate: jest.fn(),
            status: 'success',
        });

        render(
            <Router history={history}>
                <ModalProvider>
                    <AvailableCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        expect(screen.getByTestId('dt_ctrader_success_modal')).toBeInTheDocument();
    });

    it('shows error modal when account creation fails', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            error: { error: { message: 'Test error' } },
            isLoading: false,
            isSuccess: false,
            mutate: jest.fn(),
            status: 'error',
        });

        render(
            <Router history={history}>
                <ModalProvider>
                    <AvailableCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        expect(screen.getByTestId('dt_wallet_error')).toBeInTheDocument();
        expect(screen.getAllByText('Test error')[0]).toBeInTheDocument();
        expect(screen.getByText('Try again')).toBeInTheDocument();

        userEvent.click(screen.getByText('Try again'));
        expect(screen.queryByTestId('dt_wallet_error')).not.toBeInTheDocument();
    });

    it('shows default content in error modal when error details is not received', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: false,
            mutate: jest.fn(),
            status: 'error',
        });

        render(
            <Router history={history}>
                <ModalProvider>
                    <AvailableCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        expect(screen.getByTestId('dt_wallet_error')).toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong. Please try again')).toBeInTheDocument();
        expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('disables the card when account creation is loading', () => {
        (useCreateOtherCFDAccount as jest.Mock).mockReturnValue({
            isLoading: true,
            isSuccess: false,
            mutate: jest.fn(),
            status: 'loading',
        });

        render(
            <ModalProvider>
                <AvailableCTraderAccountsList />
            </ModalProvider>
        );
        expect(screen.getByTestId('dt_wallets_trading_account_card')).toHaveClass(
            'wallets-trading-account-card--disabled'
        );
    });
});
