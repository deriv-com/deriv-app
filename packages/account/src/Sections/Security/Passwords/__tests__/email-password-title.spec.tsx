import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailPasswordTitle from '../email-password-title';
import { AccountsDerivXIcon, BrandDerivLogoCoralIcon, LegacyEmailIcon } from '@deriv/quill-icons';

jest.mock('@deriv/quill-icons', () => ({
    AccountsDerivXIcon: jest.fn(() => null),
    BrandDerivLogoCoralIcon: jest.fn(() => null),
    PartnersProductDerivMt5BrandLightLogoHorizontalIcon: jest.fn(() => null),
    LegacyEmailIcon: jest.fn(() => null),
}));

describe('EmailPasswordTitle', () => {
    it('renders the correct icon and title for deriv_email', () => {
        render(<EmailPasswordTitle icon='deriv_email' title='Email' />);

        expect(LegacyEmailIcon).toHaveBeenCalledWith({ iconSize: 'sm' }, {});
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders the correct icon and title for deriv_password', () => {
        render(<EmailPasswordTitle icon='deriv_password' title='Deriv Password' />);

        expect(BrandDerivLogoCoralIcon).toHaveBeenCalledWith({ height: 24, width: 24 }, {});
        expect(screen.getByText('Deriv Password')).toBeInTheDocument();
    });

    it('renders the correct icon and title for deriv_mt5_password', () => {
        render(<EmailPasswordTitle icon='deriv_mt5_password' title='MT5 Password' />);

        expect(BrandDerivLogoCoralIcon).toHaveBeenCalledWith({ height: 24, width: 24 }, {});
        expect(screen.getByText('MT5 Password')).toBeInTheDocument();
    });

    it('renders the correct icon and title for deriv_x_password', () => {
        render(<EmailPasswordTitle icon='deriv_x_password' title='Deriv X Password' />);

        expect(AccountsDerivXIcon).toHaveBeenCalledWith({ iconSize: 'sm' }, {});
        expect(screen.getByText('Deriv X Password')).toBeInTheDocument();
    });
});
