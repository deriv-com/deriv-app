import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierDefault from '../cashier-default';
import CashierDefaultDetails from '../cashier-default-details';
import CashierDefaultSideNote from '../cashier-default-side-note';

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

describe('<CashierDefaultDetails />', () => {
    let props;
    beforeEach(() => {
        props = {
            detail_click: jest.fn(),
            detail_description: 'Deposit via the following payment methods:',
            detail_header: 'Deposit via bank wire, credit card, and e-wallet',
            is_dark_mode_on: false,
            is_mobile: false,
            detail_contents: [
                {
                    icons: [
                        {
                            dark: 'IcWalletCreditDebitDark',
                            light: 'IcWalletCreditDebitLight',
                        },
                    ],
                },
            ],
        };
    });

    it('should show the proper messages', () => {
        render(<CashierDefaultDetails {...props} />);

        expect(screen.getByText('Deposit via bank wire, credit card, and e-wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit via the following payment methods:')).toBeInTheDocument();
    });

    it('should show contain the correct className, when detail_contents has icons', () => {
        const { container } = render(<CashierDefaultDetails {...props} />);

        expect(container.querySelector('.cashier-default-detail__array')).not.toBe(null);
    });

    it('should trigger onClick callback, when the user clicks on the block with details', () => {
        const { container } = render(<CashierDefaultDetails {...props} />);

        const details_block = container.querySelector('.cashier-default-detail__div');
        fireEvent.click(details_block);

        expect(props.detail_click).toHaveBeenCalledTimes(1);
    });
});

describe('<CashierDefaultSideNote />', () => {
    const textContentMatcher = text => {
        return (content, node) => {
            const hasText = element => element.textContent === text;
            const node_has_text = hasText(node);
            const children_dont_have_ext = Array.from(node?.children || []).every(child => !hasText(child));
            return node_has_text && children_dont_have_ext;
        };
    };
    it('should show the proper messages, with fiat currency and can_change_fiat_currency={false} property', () => {
        render(<CashierDefaultSideNote currency={'USD'} can_change_fiat_currency={false} is_crypto={false} />);

        expect(screen.getByText('Your fiat account currency is set to USD.')).toBeInTheDocument();
        expect(
            screen.getByText(
                textContentMatcher(
                    "You can no longer change your account currency because you've made a deposit into your fiat account or created a real DMT5 or Deriv X account. Please contact us via live chat for clarification."
                )
            )
        ).toBeInTheDocument();
    });

    it('should trigger onClick callback when the client clicks the "live chat" link', () => {
        window.LC_API = {
            open_chat_window: jest.fn(),
        };
        render(<CashierDefaultSideNote currency={'USD'} can_change_fiat_currency={false} is_crypto={false} />);

        const live_chat_link = screen.getByText('live chat');
        fireEvent.click(live_chat_link);
        expect(window.LC_API.open_chat_window).toHaveBeenCalledTimes(1);
    });

    it('should show the proper messages, with fiat currency and can_change_fiat_currency={true} property', () => {
        render(<CashierDefaultSideNote currency={'USD'} can_change_fiat_currency is_crypto={false} />);

        expect(screen.getByText('Your fiat account currency is set to USD.')).toBeInTheDocument();
        expect(
            screen.getByText(
                textContentMatcher(
                    'You can set a new currency before you deposit for the first time or create a real DMT5 or Deriv X account.'
                )
            )
        ).toBeInTheDocument();
    });

    it('should trigger onClick callback when the client clicks the "set a new currency" link', () => {
        const openRealAccountSignup = jest.fn();
        render(
            <CashierDefaultSideNote
                currency={'USD'}
                can_change_fiat_currency
                is_crypto={false}
                openRealAccountSignup={openRealAccountSignup}
            />
        );

        const set_a_new_currency_link = screen.getByText('set a new currency');
        fireEvent.click(set_a_new_currency_link);
        expect(openRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should show the proper messages when is_crypto is true', () => {
        render(<CashierDefaultSideNote currency={'BTC'} is_crypto />);

        expect(screen.getByText('This is your BTC account.')).toBeInTheDocument();
        expect(
            screen.getByText("Don't want to trade in BTC? You can open another cryptocurrency account.")
        ).toBeInTheDocument();
        expect(screen.getByText('Manage your accounts')).toBeInTheDocument();
    });

    it('should trigger onClick callbacks when the client clicks on "Manage your accounts" link', () => {
        const openRealAccountSignup = jest.fn();
        const setDepositTarget = jest.fn();
        const { container } = render(
            <CashierDefaultSideNote
                currency={'BTC'}
                is_crypto
                openRealAccountSignup={openRealAccountSignup}
                setDepositTarget={setDepositTarget}
            />
        );

        const link = container.querySelector('.cashier-default-side-note__link');
        fireEvent.click(link);
        expect(openRealAccountSignup).toHaveBeenCalledTimes(1);
        expect(setDepositTarget).toHaveBeenCalledTimes(1);
    });
});
