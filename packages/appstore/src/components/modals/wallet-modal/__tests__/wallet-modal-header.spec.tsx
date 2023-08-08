import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletModalHeader from '../wallet-modal-header';

jest.mock('@deriv/hooks', () => ({
    useCurrencyConfig: () => ({ getConfig: () => ({ display_code: 'USD' }) }),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: {
                        fractional_digits: 2,
                        is_deposit_suspended: 0,
                        is_suspended: 0,
                        is_withdrawal_suspended: 0,
                        name: 'US Dollar',
                        stake_default: 10,
                        type: 'fiat',
                    },
                },
            },
        },
    })),
}));

describe('WalletModalHeader', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalHeader>;

    beforeEach(() => {
        mocked_props = {
            closeModal: jest.fn(),
            is_dark: false,
            is_mobile: false,
            is_wallet_name_visible: true,
            wallet: {
                balance: 1000,
                currency: 'USD',
                currency_config: {
                    display_code: 'USD',
                    is_crypto: false,
                } as typeof mocked_props['wallet']['currency_config'],
                gradient_card_class: 'wallet-card__usd',
                gradient_header_class: 'wallet-header__usd',
                icon: 'IcWalletIcon',
                is_demo: true,
                is_disabled: 0,
                is_malta_wallet: false,
                is_selected: true,
                is_virtual: 1,
                landing_company_name: 'svg',
                wallet_currency_type: 'USD',
            },
        };
    });

    it('Should render header with proper title, balance, badge and icons', () => {
        render(<WalletModalHeader {...mocked_props} />);

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('1,000.00 USD')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallet_icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt_close_icon')).toBeInTheDocument();
    });

    it('Should trigger onClose callback when the user clicked on the cross close button', () => {
        render(<WalletModalHeader {...mocked_props} />);

        const el_close_btn = screen.getByTestId('dt_close_icon');
        userEvent.click(el_close_btn);

        expect(mocked_props.closeModal).toHaveBeenCalledTimes(1);
    });
});
