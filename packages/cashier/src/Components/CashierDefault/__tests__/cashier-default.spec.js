import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierDefault from '../cashier-default';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CashierDefault />', () => {
    const mockProps = () => ({
        onMountCashierDefault: jest.fn(),
        showP2pInCashierDefault: jest.fn(),
        setIsCashierDefault: jest.fn(),
        accounts_list: [
            {
                balance: '10000.00',
                currency: 'USD',
                is_crypto: false,
                is_dxtrade: false,
                is_mt: false,
                text: 'USD',
                value: 'CR90000104',
            },
        ],
        is_switching: false,
        is_landing_company_loaded: true,
    });

    it('should show the proper messages', () => {
        const props = mockProps();
        render(<CashierDefault {...props} is_payment_agent_visible_in_onboarding show_p2p_in_cashier_default />);

        expect(screen.getByText('Choose a way to fund your account')).toBeInTheDocument();
        expect(
            screen.getByText('Please note that some payment methods might not be available in your country.')
        ).toBeInTheDocument();
        expect(screen.getByText('Deposit via bank wire, credit card, and e-wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit via the following payment methods:')).toBeInTheDocument();
        expect(screen.getByText('Deposit cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('We accept the following cryptocurrencies:')).toBeInTheDocument();
        expect(screen.getByText('Buy cryptocurrencies via fiat onramp')).toBeInTheDocument();
        expect(screen.getByText('Choose any of these exchanges to buy cryptocurrencies:')).toBeInTheDocument();
        expect(screen.getByText('Deposit via payment agents')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deposit in your local currency via an authorised, independent payment agent in your country.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Deposit with Deriv P2P')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
            )
        ).toBeInTheDocument();
    });

    it('should show the "Learn more about payment methods" message in Mobile mode', () => {
        const props = mockProps();
        render(<CashierDefault {...props} is_mobile />);

        expect(screen.getByText('Learn more about payment methods')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Learn more about payment methods" message in Mobile mode', () => {
        const props = mockProps();
        window.open = jest.fn();
        const { container } = render(<CashierDefault {...props} is_mobile />);
        const link = container.querySelector('.cashier-default-header-learn-more');
        fireEvent.click(link);

        expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should not show "Choose a way to fund your account" message if is_switching is true', () => {
        const props = mockProps();
        render(<CashierDefault {...props} is_switching />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });

    it('should not show "Choose a way to fund your account" message if accounts_list is an empty array', () => {
        const props = mockProps();
        render(<CashierDefault {...props} accounts_list={[]} />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });

    it('should not show "Choose a way to fund your account" message if is_landing_company_loaded is false', () => {
        const props = mockProps();
        render(<CashierDefault {...props} is_landing_company_loaded={false} />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });
});
