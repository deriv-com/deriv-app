import React from 'react';
import { render, screen, waitFor, fireEvent, queryByText } from '@testing-library/react';
import DerivPassword from '../deriv-password';
import { WS } from '@deriv/shared';

jest.mock('Assets/ic-brand-deriv-red.svg', () => () => 'BrandDerivRed');

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        verifyEmail: jest.fn(),
    },
}));

describe('<DerivPassword />', () => {
    let mock_props = {
        email: 'mf@deriv.com',
        is_social_signup: false,
        social_identity_provider: undefined,
        is_eu_user: false,
        financial_restricted_countries: false,
    };

    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('Should render properly', async () => {
        render(<DerivPassword {...mock_props} />);
        expect(
            screen.getByRole('heading', {
                name: /deriv password/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/use the to log in to deriv\.com, deriv go, deriv trader, smarttrader, and deriv bot\./i)
        ).toBeInTheDocument();
        // expect BrandDerivRed not to be in the document
        expect(screen.queryByText(/BrandDerivRed/i)).toBeInTheDocument();
        // expect button with text change password to be in the document
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
        // expect button with text unlink from to not be in the document
        expect(screen.queryByText(/unlink from/i)).not.toBeInTheDocument();

        const popover_wrapper = screen.getAllByTestId('dt_popover_wrapper');
        expect(popover_wrapper).toHaveLength(4);
    });

    it('displays the correct platform information for non-MF clients & restricted countries', () => {
        render(<DerivPassword {...mock_props} financial_restricted_countries />);

        expect(screen.getByText(/use the to log in to deriv\.com, deriv trader and deriv go\./i));

        const popover_wrapper = screen.getAllByTestId('dt_popover_wrapper');
        // expect popover to have length of 2
        expect(popover_wrapper).toHaveLength(2);
        // expect button with text change password to be in the document
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('displays the correct platform information for MF clients', () => {
        render(<DerivPassword {...mock_props} is_eu_user />);

        expect(screen.getByText(/use the to log in to deriv\.com and deriv trader\./i)).toBeInTheDocument();

        const popover_wrapper = screen.getAllByTestId('dt_popover_wrapper');
        // expect popover to have length of 4
        expect(popover_wrapper).toHaveLength(1);
        // expect button with text change password to be in the document
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('displays a change password button for non-social signups', () => {
        render(<DerivPassword {...mock_props} />);
        const change_password_button = screen.getByRole('button', {
            name: /change password/i,
        });
        expect(change_password_button).toBeInTheDocument();
    });

    it('should invoke verifyEmail when change password is clicked', async () => {
        render(<DerivPassword {...mock_props} />);
        const ele_change_btn = screen.getByRole('button', {
            name: /change password/i,
        });
        fireEvent.click(ele_change_btn);
        expect(screen.queryByText(/we’ve sent you an email/i)).toBeInTheDocument();
        expect(screen.getByText(/please click on the link in the email to reset your password\./i)).toBeInTheDocument();
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('displays a button to unlink social identity provider', async () => {
        const social_props = {
            ...mock_props,
            is_social_signup: true,
            social_identity_provider: 'apple',
        };
        render(<DerivPassword {...social_props} />);
        const unlink_button = screen.getByText(/unlink from/i);
        expect(unlink_button).toBeInTheDocument();
        fireEvent.click(unlink_button);

        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });
});
