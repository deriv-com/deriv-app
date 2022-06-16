import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierDefaultSideNote from '../cashier-default-side-note';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

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
