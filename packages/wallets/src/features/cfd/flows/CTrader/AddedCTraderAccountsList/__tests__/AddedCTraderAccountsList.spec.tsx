import React, { ReactNode } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api';
import { fireEvent, render, screen } from '@testing-library/react';
import AddedCTraderAccountsList from '../AddedCTraderAccountsList';

type TradingAccountCardProps = {
    children: ReactNode;
    leading: () => ReactNode;
    trailing: () => ReactNode;
};

jest.mock('@deriv/api', () => ({
    useCtraderAccountsList: jest.fn(),
}));

jest.mock('../../../../../../components/', () => ({
    TradingAccountCard: ({ children, leading, trailing }: TradingAccountCardProps) => (
        <div>
            {leading && <div>{leading()}</div>}
            {children}
            {trailing && <div>{trailing()}</div>}
        </div>
    ),
}));

const mockShow = jest.fn();
jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: () => ({ show: mockShow }),
}));

jest.mock('../../../../../../helpers/urls', () => ({
    getStaticUrl: () => 'https://deriv.com/deriv-ctrader',
}));

jest.mock('../../../../../../public/images/ctrader.svg', () => {
    const MockedSvg = () => <div>CTrader</div>;
    MockedSvg.displayName = 'MockedSvg';
    return MockedSvg;
});

describe('AddedCTraderAccountsList', () => {
    const history = createMemoryHistory();
    const mockAccounts = [
        { formatted_balance: '1000', login: '123' },
        { formatted_balance: '2000', login: '456' },
    ];

    beforeEach(() => {
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: mockAccounts,
        });
    });

    it('renders TradingAccountCard with cTraderAccounts', () => {
        render(
            <Router history={history}>
                <AddedCTraderAccountsList />
            </Router>
        );

        mockAccounts.forEach(account => {
            expect(screen.getByText(account.login)).toBeInTheDocument();
            expect(screen.getByText(account.formatted_balance)).toBeInTheDocument();
        });
    });

    it('renders the icon and opens the link when clicked', () => {
        const mockWindowOpen = jest.fn();
        window.open = mockWindowOpen;

        render(
            <Router history={history}>
                <AddedCTraderAccountsList />
            </Router>
        );

        const icon = screen.getByText('CTrader');
        fireEvent.click(icon);
        expect(mockWindowOpen).toHaveBeenCalledWith('https://deriv.com/deriv-ctrader');
    });

    it('opens the link when Enter key is pressed for sonarcloud', () => {
        const mockWindowOpen = jest.fn();
        window.open = mockWindowOpen;

        render(
            <Router history={history}>
                <AddedCTraderAccountsList />
            </Router>
        );

        const icon = screen.getByText('CTrader');
        fireEvent.keyDown(icon, { code: 'Enter', key: 'Enter' });
        expect(mockWindowOpen).toHaveBeenCalledWith('https://deriv.com/deriv-ctrader');
    });

    it('redirects to cashier transfer page when Transfer button is clicked', () => {
        render(
            <Router history={history}>
                <AddedCTraderAccountsList />
            </Router>
        );

        const transferButton = screen.getByText('Transfer');
        fireEvent.click(transferButton);
        expect(history.location.pathname).toEqual('/wallets/cashier/transfer');
    });

    it('opens the MT5TradeModal when Open button is clicked', () => {
        render(
            <Router history={history}>
                <AddedCTraderAccountsList />
            </Router>
        );

        const openButton = screen.getByText('Open');
        fireEvent.click(openButton);
        expect(mockShow).toHaveBeenCalled();
    });
});
