import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierOnboardingDetails from '../cashier-onboarding-details';
import type { TCashierOnboardingProvider } from '../cashier-onboarding-providers';

describe('<CashierOnboardingDetails />', () => {
    let props: TCashierOnboardingProvider;
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
        render(<CashierOnboardingDetails {...props} />);

        expect(screen.getByText('Deposit via bank wire, credit card, and e-wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit via the following payment methods:')).toBeInTheDocument();
    });

    it('should show contain the correct className, when detail_contents has icons', () => {
        render(<CashierOnboardingDetails {...props} />);

        expect(screen.getByTestId('dt_cashier_onboarding_detail_array')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when the user clicks on the block with details', () => {
        render(<CashierOnboardingDetails {...props} />);

        const details_block = screen.getByTestId('dt_cashier_onboarding_detail_div');
        fireEvent.click(details_block);

        expect(props.detail_click).toHaveBeenCalledTimes(1);
    });
});
