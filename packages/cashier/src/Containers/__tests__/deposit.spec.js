import React from 'react';
import { render, screen } from '@testing-library/react';
import Deposit from '../deposit';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));
jest.mock('Components/Error/virtual', () => () => <div>Virtual</div>);
jest.mock('Components/Error/cashier-locked', () => () => <div>CashierLocked</div>);
jest.mock('Components/Error/funds-protection', () => () => <div>FundsProtection</div>);
jest.mock('Components/Error/deposit-locked', () => () => <div>DepositsLocked</div>);
jest.mock('Components/Form/crypto-transactions-history', () => () => <div>CryptoTransactionsHistory</div>);
jest.mock('Components/Error/error', () => () => <div>Error</div>);
jest.mock('../crypto-deposit', () => () => <div>CryptoDeposit</div>);
jest.mock('Components/cashier-container', () => () => <div>CashierContainer</div>);
jest.mock('Components/CashierDefault/cashier-default', () => () => <div>CashierDefault</div>);

describe('<Deposit />', () => {
    const props = {
        currency: 'USD',
        current_currency_type: 'fiat',
        error: { is_ask_uk_funds_protection: false, message: '' },
        is_cashier_locked: false,
        is_crypto_transactions_visible: false,
        is_deposit: false,
        is_deposit_locked: false,
        is_eu: false,
        is_loading: false,
        is_switching: false,
        is_system_maintenance: false,
        is_virtual: false,
        onMount: jest.fn(),
        recentTransactionOnMount: jest.fn(),
        setActiveTab: jest.fn(),
        setIsDeposit: jest.fn(),
        setErrorMessage: jest.fn(),
        setSideNotes: jest.fn(),
    };

    it('should render <Loading /> component', () => {
        const { rerender } = render(<Deposit {...props} is_switching is_loading={false} iframe_url='' />);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<Deposit {...props} is_switching={false} is_loading iframe_url='' />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <Virtual /> component', () => {
        render(<Deposit {...props} is_virtual />);

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component', () => {
        const { rerender } = render(<Deposit {...props} is_system_maintenance is_cashier_locked />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();

        rerender(<Deposit {...props} is_system_maintenance is_deposit_locked current_currency_type='crypto' />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();

        rerender(<Deposit {...props} is_cashier_locked />);

        expect(screen.getByText('CashierLocked')).toBeInTheDocument();
    });

    it('should render <FundsProtection /> component', () => {
        render(<Deposit {...props} error={{ is_ask_uk_funds_protection: true }} />);

        expect(screen.getByText('FundsProtection')).toBeInTheDocument();
    });

    it('should render <DepositsLocked /> component', () => {
        render(<Deposit {...props} is_deposit_locked />);

        expect(screen.getByText('DepositsLocked')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        render(<Deposit {...props} is_crypto_transactions_visible />);

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        render(<Deposit {...props} is_deposit error={{ message: 'error' }} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <CryptoDeposit /> component', () => {
        render(<Deposit {...props} is_eu currency='BTC' is_crypto />);

        expect(screen.getByText('CryptoDeposit')).toBeInTheDocument();
    });

    it('should render <CashierContainer /> component', () => {
        render(<Deposit {...props} is_deposit />);

        expect(screen.getByText('CashierContainer')).toBeInTheDocument();
    });

    it('should render <CashierDefault /> component', () => {
        render(<Deposit {...props} />);

        expect(screen.getByText('CashierDefault')).toBeInTheDocument();
    });

    it('should trigger "setSideNotes" callback', () => {
        render(<Deposit {...props} is_deposit crypto_transactions={[{}]} currency='UST' is_crypto />);

        expect(props.setSideNotes).toHaveBeenCalledTimes(2);
    });
});
