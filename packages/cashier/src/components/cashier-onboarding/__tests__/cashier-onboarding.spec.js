import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierOnboarding from '../cashier-onboarding';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { routes } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CashierOnboarding />', () => {
    const mockProps = () => ({
        onMountCashierOnboarding: jest.fn(),
        openRealAccountSignup: jest.fn(),
        setDepositTarget: jest.fn(),
        setIsCashierOnboarding: jest.fn(),
        setIsDeposit: jest.fn(),
        setSideNotes: jest.fn(),
        setShouldShowAllAvailableCurrencies: jest.fn(),
        shouldNavigateAfterChooseCrypto: jest.fn(),
        shouldNavigateAfterPrompt: jest.fn(),
        showP2pInCashierOnboarding: jest.fn(),
        toggleSetCurrencyModal: jest.fn(),
        has_set_currency: true,
        is_switching: false,
        is_landing_company_loaded: true,
    });

    it('should show the proper messages when <CashierOnboarding /> is rendered with fiat account', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        render(
            <CashierOnboarding
                {...props}
                currency='USD'
                is_payment_agent_visible_in_onboarding
                show_p2p_in_cashier_onboarding
            />
        );

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

    it('should show the proper message when <CashierOnboarding /> is rendered with crypto account', () => {
        const props = mockProps();
        props.accounts = { CR90000002: { is_virtual: 0, currency: 'BTC' } };
        render(
            <CashierOnboarding
                {...props}
                available_crypto_currencies={['BTC', 'ETH']}
                currency='BTC'
                is_payment_agent_visible_in_onboarding
            />
        );

        expect(screen.getByText('Buy cryptocurrencies')).toBeInTheDocument();
        expect(screen.queryByText('Buy cryptocurrencies via fiat onramp')).not.toBeInTheDocument();
    });

    it('should trigger proper callbacks when the client chooses "Deposit via bank wire, credit card, and e-wallet" section from his fiat account', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        const { container } = render(<CashierOnboarding {...props} currency='USD' />);

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_bank_card_ewallet_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('Deposit via the following payment methods:')
        );
        fireEvent.click(deposit_bank_card_ewallet_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.setIsDeposit).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit via bank wire, credit card, and e-wallet" section from his crypto account, not having the fiat account', () => {
        const props = mockProps();
        props.accounts = { CR90000002: { is_virtual: 0, currency: 'BTC' } };
        const { container } = render(
            <CashierOnboarding {...props} currency='BTC' available_crypto_currencies={['BTC', 'ETH']} />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_bank_card_ewallet_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('Deposit via the following payment methods:')
        );
        fireEvent.click(deposit_bank_card_ewallet_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit via bank wire, credit card, and e-wallet" section from his crypto account, having the fiat account', () => {
        const props = mockProps();
        props.accounts = {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        };
        const { container } = render(
            <CashierOnboarding {...props} currency='BTC' available_crypto_currencies={['BTC', 'ETH']} />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_bank_card_ewallet_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('Deposit via the following payment methods:')
        );
        fireEvent.click(deposit_bank_card_ewallet_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.shouldNavigateAfterPrompt).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit cryptocurrencies" section from his fiat account, not having the crypto account', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        const { container } = render(<CashierOnboarding {...props} currency='USD' />);

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_crypto_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('We accept the following cryptocurrencies:')
        );
        fireEvent.click(deposit_crypto_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit cryptocurrencies" section from his crypto account', () => {
        const props = mockProps();
        props.accounts = { CR90000002: { is_virtual: 0, currency: 'BTC' } };
        const { container } = render(
            <CashierOnboarding {...props} available_crypto_currencies={['BTC', 'ETH']} currency='BTC' />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_crypto_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('We accept the following cryptocurrencies:')
        );
        fireEvent.click(deposit_crypto_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
        expect(props.shouldNavigateAfterChooseCrypto).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Buy cryptocurrencies via fiat onramp" section from his fiat account, not having the crypto account', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        const { container } = render(<CashierOnboarding {...props} currency='USD' />);

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const buy_crypto_onramp_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('Choose any of these exchanges to buy cryptocurrencies:')
        );
        fireEvent.click(buy_crypto_onramp_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Buy cryptocurrencies" section from his crypto account', () => {
        const props = mockProps();
        props.accounts = { CR90000002: { is_virtual: 0, currency: 'BTC' } };
        const { container } = render(
            <CashierOnboarding {...props} available_crypto_currencies={['BTC', 'ETH']} currency='BTC' />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const buy_crypto_onramp_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes('Choose any of these exchanges to buy cryptocurrencies:')
        );
        fireEvent.click(buy_crypto_onramp_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
        expect(props.shouldNavigateAfterChooseCrypto).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit via payment agents" section', () => {
        const props = mockProps();
        props.accounts = {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        };
        const { container } = render(
            <CashierOnboarding {...props} currency='USD' is_payment_agent_visible_in_onboarding />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_via_pa_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes(
                'Deposit in your local currency via an authorised, independent payment agent in your country.'
            )
        );
        fireEvent.click(deposit_via_pa_detail_div);

        expect(props.setShouldShowAllAvailableCurrencies).toHaveBeenCalledTimes(1);
        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit with Deriv P2P" section from his fiat account', () => {
        const props = mockProps();
        const history = createBrowserHistory();
        props.accounts = {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        };
        const { container } = render(
            <Router history={history}>
                <CashierOnboarding {...props} currency='USD' show_p2p_in_cashier_onboarding />
            </Router>
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_with_dp2p_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes(
                'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
            )
        );
        fireEvent.click(deposit_with_dp2p_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(history.location.pathname).toBe(routes.cashier_p2p);
    });

    it('should trigger proper callbacks when the client chooses "Deposit with Deriv P2P" section from his crypto account, already having the fiat account', () => {
        const props = mockProps();
        props.accounts = {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        };
        const { container } = render(
            <CashierOnboarding
                {...props}
                available_crypto_currencies={['BTC', 'ETH']}
                currency='BTC'
                show_p2p_in_cashier_onboarding
            />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_with_dp2p_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes(
                'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
            )
        );
        fireEvent.click(deposit_with_dp2p_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.shouldNavigateAfterPrompt).toHaveBeenCalledTimes(1);
    });

    it('should trigger proper callbacks when the client chooses "Deposit with Deriv P2P" section from his crypto account, not having the fiat account', () => {
        const props = mockProps();
        props.accounts = { CR90000002: { is_virtual: 0, currency: 'BTC' } };
        const { container } = render(
            <CashierOnboarding
                {...props}
                available_crypto_currencies={['BTC', 'ETH']}
                currency='BTC'
                show_p2p_in_cashier_onboarding
            />
        );

        const node_list = container.querySelectorAll('.cashier-onboarding-detail__div');
        const deposit_with_dp2p_detail_div = Array.from(node_list).find(node =>
            node.textContent.includes(
                'Deposit in your local currency via peer-to-peer exchange with fellow traders in your country.'
            )
        );
        fireEvent.click(deposit_with_dp2p_detail_div);

        expect(props.setDepositTarget).toHaveBeenCalledTimes(1);
        expect(props.openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should show the "Learn more about payment methods" message in Mobile mode', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        render(<CashierOnboarding {...props} is_mobile />);

        expect(screen.getByText('Learn more about payment methods')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the user clicks "Learn more about payment methods" message in Mobile mode', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        window.open = jest.fn();
        const { container } = render(<CashierOnboarding {...props} is_mobile />);
        const link = container.querySelector('.cashier-onboarding-header-learn-more');
        fireEvent.click(link);

        expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should not show "Choose a way to fund your account" message if is_switching is true', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        render(<CashierOnboarding {...props} is_switching />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });

    it('should not show "Choose a way to fund your account" message if accounts_list is an empty array', () => {
        const props = mockProps();
        props.accounts = [];
        render(<CashierOnboarding {...props} />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });

    it('should not show "Choose a way to fund your account" message if is_landing_company_loaded is false', () => {
        const props = mockProps();
        props.accounts = { CR90000001: { is_virtual: 0, currency: 'USD' } };
        render(<CashierOnboarding {...props} is_landing_company_loaded={false} />);

        expect(screen.queryByText('Choose a way to fund your account')).not.toBeInTheDocument();
    });

    it('should redirect to "routes.trade" when the component will unmount', () => {
        const props = mockProps();
        const history = createBrowserHistory();
        props.accounts = {
            CR90000001: { is_virtual: 0, currency: 'USD' },
            CR90000002: { is_virtual: 0, currency: 'BTC' },
        };
        props.has_set_currency = false;
        const { unmount } = render(
            <Router history={history}>
                <CashierOnboarding {...props} currency='USD' />
            </Router>
        );

        unmount();
        expect(history.location.pathname).toBe(routes.trade);
        expect(props.toggleSetCurrencyModal).toHaveBeenCalledTimes(1);
    });
});
