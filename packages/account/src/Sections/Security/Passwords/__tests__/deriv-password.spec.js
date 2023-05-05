import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DerivPassword from '../deriv-password';
import { WS } from '@deriv/shared';

jest.mock('Assets/ic-brand-deriv-red.svg', () => () => <></>);

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
        landing_company_shortcode: 'maltainvest',
    };
    test('Should render properly', async () => {
        render(<DerivPassword {...mock_props} />);
        expect(
            screen.getByRole('heading', {
                name: /deriv password/i,
            })
        ).toBeInTheDocument();
    });

    test('displays the correct platform information for non-MF clients', () => {
        const { container } = render(<DerivPassword {...mock_props} landing_company_shortcode='svg' />);
        expect(container.getElementsByClassName(/passwords-platform__icons/i)).not.toBeNull();
    });

    test('displays the correct platform information for MF clients', () => {
        const { container } = render(<DerivPassword {...mock_props} />);
        const passwordsIconsElement = container.querySelector('.passwords-platform__icons');
        expect(passwordsIconsElement).toBeNull();
    });

    test('displays a change password button for non-social signups', () => {
        render(<DerivPassword {...mock_props} />);
        const change_password_button = screen.getByRole('button', {
            name: /change password/i,
        });
        expect(change_password_button).toBeInTheDocument();
    });

    test('should invoke verifyEmail when change password is clicked', async () => {
        render(<DerivPassword {...mock_props} />);
        const ele_change_btn = screen.getByRole('button', {
            name: /change password/i,
        });
        fireEvent.click(ele_change_btn);
        await waitFor(() => {
            expect(WS.verifyEmail).toHaveBeenCalled();
        });
    });

    it('displays a button to unlink social identity provider', () => {
        const social_props = {
            ...mock_props,
            is_social_signup: true,
            social_identity_provider: 'apple',
        };
        render(<DerivPassword {...social_props} />);
        const unlink_button = screen.getByText(/unlink from/i);
        expect(unlink_button).toBeInTheDocument();
    });
});
