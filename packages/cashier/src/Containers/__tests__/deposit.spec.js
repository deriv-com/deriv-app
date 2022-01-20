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
    const mockDefaultProps = () => ({
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
    });
    it('should render <Loading /> component', () => {
        const renderWithCustomProperties = properties => {
            const props = mockDefaultProps();
            props.iframe_url = '';
            for (let [prop, value] of Object.entries(properties)) {
                props[prop] = value;
            }

            const { unmount } = render(<Deposit {...props} />);

            expect(screen.getByText('Loading')).toBeInTheDocument();

            unmount();
        };

        renderWithCustomProperties({ is_switching: true, is_loading: false });
        renderWithCustomProperties({ is_switching: false, is_loading: true });
    });

    it('should render <Virtual /> component', () => {
        const props = mockDefaultProps();
        props.is_virtual = true;

        render(<Deposit {...props} />);

        expect(screen.getByText('Virtual')).toBeInTheDocument();
    });

    it('should render <CashierLocked /> component', () => {
        const renderWithCustomProperties = properties => {
            const props = mockDefaultProps();

            for (let [prop, value] of Object.entries(properties)) {
                props[prop] = value;
            }

            const { unmount } = render(<Deposit {...props} />);

            expect(screen.getByText('CashierLocked')).toBeInTheDocument();

            unmount();
        };

        renderWithCustomProperties({ is_system_maintenance: true, is_cashier_locked: true });
        renderWithCustomProperties({
            is_system_maintenance: true,
            is_deposit_locked: true,
            current_currency_type: 'crypto',
        });
        renderWithCustomProperties({ is_cashier_locked: true });
    });

    it('should render <FundsProtection /> component', () => {
        const props = mockDefaultProps();
        props.error.is_ask_uk_funds_protection = true;

        render(<Deposit {...props} />);

        expect(screen.getByText('FundsProtection')).toBeInTheDocument();
    });

    it('should render <DepositsLocked /> component', () => {
        const props = mockDefaultProps();
        props.is_deposit_locked = true;

        render(<Deposit {...props} />);

        expect(screen.getByText('DepositsLocked')).toBeInTheDocument();
    });

    it('should render <CryptoTransactionsHistory /> component', () => {
        const props = mockDefaultProps();
        props.is_crypto_transactions_visible = true;

        render(<Deposit {...props} />);

        expect(screen.getByText('CryptoTransactionsHistory')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const props = mockDefaultProps();
        props.is_deposit = true;
        props.error.message = 'error';

        render(<Deposit {...props} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <CryptoDeposit /> component', () => {
        const props = mockDefaultProps();
        props.is_eu = true;
        props.currency = 'BTC';

        render(<Deposit {...props} />);

        expect(screen.getByText('CryptoDeposit')).toBeInTheDocument();
    });

    it('should render <CashierContainer /> component', () => {
        const props = mockDefaultProps();
        props.is_deposit = true;

        render(<Deposit {...props} />);

        expect(screen.getByText('CashierContainer')).toBeInTheDocument();
    });

    it('should render <CashierDefault /> component', () => {
        const props = mockDefaultProps();

        render(<Deposit {...props} />);

        expect(screen.getByText('CashierDefault')).toBeInTheDocument();
    });

    it('should trigger "setSideNotes" callback', () => {
        const props = mockDefaultProps();
        props.is_deposit = true;
        props.crypto_transactions = [{}];
        props.currency = 'UST';

        render(<Deposit {...props} />);

        expect(props.setSideNotes).toHaveBeenCalled();
    });
});
