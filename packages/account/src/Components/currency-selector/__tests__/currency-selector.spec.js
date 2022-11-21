import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import CurrencySelector from '../currency-selector';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

jest.mock('../../real-account-signup/helpers/utils.js', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        warnings: {},
        errors: {},
    })),
}));

describe('<CurrencySelector/>', () => {
    const props = {
        accounts: {
            VRTC90000010: {
                account_type: 'trading',
                currency: 'USD',
                is_disabled: 0,
                is_virtual: 1,
                landing_company_shortcode: 'virtual',
                trading: {},
                token: 'a1-sLGGrhfYPkeEprxEop2T591cLKbuN',
                email: 'test+qw@deriv.com',
                session_start: 1651059038,
                excluded_until: '',
                landing_company_name: 'virtual',
                residence: 'es',
                balance: 10000,
                accepted_bch: 0,
            },
        },
        legal_allowed_currencies: [
            {
                value: 'EUR',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'Euro',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 0,
                    },
                    limits: {
                        max: 4717.96,
                        min: 0.94,
                    },
                    limits_dxtrade: {
                        max: 2358.45,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 14150.68,
                        min: 0.01,
                    },
                },
                type: 'fiat',
            },
            {
                value: 'USD',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'US Dollar',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 0,
                    },
                    limits: {
                        max: 5000,
                        min: 1,
                    },
                    limits_dxtrade: {
                        max: 2500,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 15000,
                        min: 0.01,
                    },
                },
                type: 'fiat',
            },
            {
                value: 'USDC',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'USD Coin',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 2,
                    },
                    limits: {
                        max: 5001.52,
                        min: 1,
                    },
                    limits_dxtrade: {
                        max: 2500.76,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 15004.55,
                        min: 0.01,
                    },
                },
                type: 'crypto',
            },
            {
                value: 'eUSDT',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'Tether ERC20',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 2,
                    },
                    limits: {
                        max: 5001.78,
                        min: 1,
                    },
                    limits_dxtrade: {
                        max: 2500.89,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 15005.33,
                        min: 0.01,
                    },
                },
                type: 'crypto',
            },
        ],
        has_fiat: true,
        value: {
            currency: '',
        },
        validate: jest.fn(),
        is_virtual: true,
        available_crypto_currencies: [
            {
                value: 'eUSDT',
                fractional_digits: 2,
                is_deposit_suspended: 0,
                is_suspended: 0,
                is_withdrawal_suspended: 0,
                name: 'Tether ERC20',
                stake_default: 10,
                transfer_between_accounts: {
                    fees: {
                        AUD: 2,
                    },
                    limits: {
                        max: 5001.78,
                        min: 1,
                    },
                    limits_dxtrade: {
                        max: 2500.89,
                        min: 0.01,
                    },
                    limits_mt5: {
                        max: 15005.33,
                        min: 0.01,
                    },
                },
                type: 'crypto',
            },
        ],
        getCurrentStep: jest.fn(() => 1),
        onSave: jest.fn(),
        onCancel: jest.fn(),
        real_account_signup: {
            active_modal_index: -1,
            previous_currency: '',
            current_currency: '',
            success_message: '',
            error_message: '',
        },
        goToNextStep: jest.fn(),
        resetRealAccountSignupParams: jest.fn(),
        onSubmit: jest.fn(),
    };

    const fiat_msg =
        'You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit.';
    const dxtrade_eu_msg =
        'You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real CFDs or Deriv X account.';
    const dxtrade_non_eu_msg =
        'You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real Deriv MT5 or Deriv X account.';
    const mt5_eu =
        'You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real CFDs account.';
    const mt5_non_eu =
        'You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real Deriv MT5 account.';

    const runCommonTests = msg => {
        expect(screen.getByRole('heading', { name: /fiat currencies/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /us dollar \(usd\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /euro \(eur\)/i })).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /cryptocurrencies/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /tether erc20 \(eusdt\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /usd coin \(usdc\)/i })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

        const usd = screen.getByRole('radio', { name: /us dollar \(usd\)/i });
        expect(usd.checked).toEqual(false);
        fireEvent.click(usd);
        expect(usd.checked).toEqual(true);

        expect(screen.getByText(msg)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    };

    it('should render currencyselector', () => {
        render(<CurrencySelector {...props} />);
        expect(screen.getByTestId('currency_selector_form')).toBeInTheDocument();
    });

    it('should render Fiat currencies and submit the form', async () => {
        render(<CurrencySelector {...props} />);
        runCommonTests(fiat_msg);
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalled();
            expect(props.onSubmit).toHaveBeenCalledWith(
                0,
                { currency: 'USD' },
                expect.any(Function),
                props.goToNextStep
            );
        });
    });

    it('should disable fiat if user already have a fiat ', () => {
        const new_props = {
            ...props,
            accounts: {
                VRTC90000010: {
                    account_type: 'trading',
                    currency: 'USD',
                    is_disabled: 0,
                    is_virtual: 1,
                    landing_company_shortcode: 'svg',
                    trading: {},
                    token: 'a1-sLGGrhfYPkeEprxEop2T591cLKbuN',
                    email: 'test+qw@deriv.com',
                    session_start: 1651059038,
                    excluded_until: '',
                    landing_company_name: 'svg',
                    residence: 'es',
                    balance: 10000,
                    accepted_bch: 0,
                },
            },
            has_real_account: true,
            real_account_signup_target: 'svg',
        };

        render(<CurrencySelector {...new_props} />);
        expect(screen.getByRole('radio', { name: /us dollar \(usd\)/i })).toBeDisabled();
        expect(screen.getByRole('radio', { name: /euro \(eur\)/i })).toBeDisabled();
    });
    it('should render Fiat currencies when is_dxtrade_allowed and is_mt5_allowed are true', () => {
        render(<CurrencySelector {...props} is_dxtrade_allowed is_mt5_allowed />);
        runCommonTests(dxtrade_non_eu_msg);
    });

    it('should render Fiat currencies when is_dxtrade_allowed,is_eu and is_mt5_allowed are true', () => {
        render(<CurrencySelector {...props} is_dxtrade_allowed is_mt5_allowed is_eu />);
        runCommonTests(dxtrade_eu_msg);
    });

    it('should render Fiat currencies when is_mt5_allowed and is_eu are true', () => {
        render(<CurrencySelector {...props} is_mt5_allowed is_eu />);
        runCommonTests(mt5_eu);
    });

    it('should render Fiat currencies when is_mt5_allowed is true', () => {
        render(<CurrencySelector {...props} is_mt5_allowed />);
        runCommonTests(mt5_non_eu);
    });

    it('should render Cryptocurrencies and submit the form ', async () => {
        render(<CurrencySelector {...props} set_currency />);
        expect(screen.getByRole('heading', { name: /cryptocurrencies/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /tether erc20 \(eusdt\)/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /usd coin \(usdc\)/i })).toBeInTheDocument();

        const set_currency_btn = screen.getByRole('button', { name: /set currency/i });
        expect(set_currency_btn).toBeInTheDocument();
        expect(set_currency_btn).toBeDisabled();

        const tether = screen.getByRole('radio', { name: /tether erc20 \(eusdt\)/i });
        expect(tether.checked).toEqual(false);
        fireEvent.click(tether);
        expect(tether.checked).toEqual(true);

        expect(set_currency_btn).toBeEnabled();

        fireEvent.click(set_currency_btn);
        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalledWith(
                0,
                { currency: 'eUSDT' },
                expect.any(Function),
                props.goToNextStep
            );
        });
    });

    it('should submit the form when getCurrentStep is not passed ', async () => {
        const new_props = { ...props };
        delete new_props.getCurrentStep;
        render(<CurrencySelector {...new_props} />);
        runCommonTests(fiat_msg);
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalled();
            expect(props.onSubmit).toHaveBeenCalledWith(
                null,
                { currency: 'USD' },
                expect.any(Function),
                props.goToNextStep
            );
        });
    });

    it('should render the selector__container with proper div height when appstore is true', () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 150,
        });
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <CurrencySelector {...props} />
            </PlatformContext.Provider>
        );
        expect(screen.getByTestId('currency_selector_form').firstChild.getAttribute('style')).toEqual(
            'height: calc(150px - 222px);'
        );
    });

    it('should render the selector__container with proper div height', () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 150,
        });
        render(<CurrencySelector {...props} has_real_account />);
        expect(screen.getByTestId('currency_selector_form').firstChild.getAttribute('style')).toEqual(
            'height: calc(150px - 89px);'
        );
    });

    it('should call handleCancel when previous button is called', () => {
        render(<CurrencySelector {...props} has_wallet_account has_cancel />);

        const usdc = screen.getByRole('radio', { name: /usd coin \(usdc\)/i });
        expect(usdc.checked).toEqual(false);
        fireEvent.click(usdc);
        expect(usdc.checked).toEqual(true);

        expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
        const prev_btn = screen.getByRole('button', { name: /previous/i });
        expect(prev_btn).toBeInTheDocument();
        fireEvent.click(prev_btn);
        expect(props.onSave).toHaveBeenCalledWith(0, { currency: 'USDC' });
    });

    it('should bypass to next step in case of form error', () => {
        const real_account_signup = {
            ...props.real_account_signup,
            error_code: 'sample_error_code',
        };
        render(<CurrencySelector {...props} real_account_signup={real_account_signup} />);
        expect(props.goToNextStep).toHaveBeenCalled();
        expect(props.resetRealAccountSignupParams).toHaveBeenCalled();
    });
});
