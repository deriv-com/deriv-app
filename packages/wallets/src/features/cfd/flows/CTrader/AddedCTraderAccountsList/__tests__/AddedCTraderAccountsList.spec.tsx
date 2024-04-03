import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import AddedCTraderAccountsList from '../AddedCTraderAccountsList';
import { ModalProvider } from '../../../../../../components/ModalProvider';

jest.mock('@deriv/api-v2', () => ({
    useCtraderAccountsList: jest.fn(),
}));

jest.mock('../../../../modals', () => ({
    MT5TradeModal: () => <div>Mocked MT5 Trade Modal</div>,
}));

describe('AddedCTraderAccountsList', () => {
    let $root: HTMLDivElement, $modalContainer: HTMLDivElement;
    const history = createMemoryHistory();
    const mockAccounts = [
        { formatted_balance: '1000', login: '123' },
        { formatted_balance: '2000', login: '456' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        $root = document.createElement('div');
        $root.id = 'root';
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($root);
        document.body.appendChild($modalContainer);
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: mockAccounts,
        });
    });

    afterEach(() => {
        document.body.removeChild($root);
        document.body.removeChild($modalContainer);
    });

    it('renders TradingAccountCard with cTraderAccounts', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        mockAccounts.forEach(account => {
            expect(screen.getByText(account.login)).toBeInTheDocument();
            expect(screen.getByText(account.formatted_balance)).toBeInTheDocument();
        });
    });

    it('should show modal on click of cTrader account', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        fireEvent.click(screen.getAllByTestId('dt_wallets_trading_account_card')[0]);
        expect(screen.getByText('Mocked MT5 Trade Modal')).toBeInTheDocument();
    });
});
