import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import { MissingPersonalDetails } from '../missing-personal-details';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div>{props.icon}</div>),
    };
});

describe('<MissingPersonalDetails />', () => {
    const renderWithRouter = component =>
        render(
            <PlatformContext.Provider value={{ is_appstore: true, is_deriv_crypto: false, is_pre_appstore: false }}>
                <BrowserRouter>{component}</BrowserRouter>
            </PlatformContext.Provider>
        );

    it('should render the MissingPersonalDetails component', () => {
        renderWithRouter(<MissingPersonalDetails />);

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details'));
    });

    it('should show invalid msg and update link if has_invalid_postal_code is true', () => {
        renderWithRouter(<MissingPersonalDetails has_invalid_postal_code from='proof_of_identity' />);

        expect(screen.getByText(/your postal code is invalid/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please check and update your postal code before submitting proof of identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetails')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /update postal code/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details?from=proof_of_identity#address_postcode'));
    });

    it('should show missing msg with proper icon if has_invalid_postal_code is false and is_appstore is true', () => {
        renderWithRouter(<MissingPersonalDetails from='proof_of_identity' />);

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please complete your personal details before you verify your identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetailsDashboard')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details?from=proof_of_identity'));
    });

    it('should show missing msg with proper icon if has_invalid_postal_code is false and is_appstore is false', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false, is_deriv_crypto: false, is_pre_appstore: false }}>
                <BrowserRouter>
                    <MissingPersonalDetails />
                </BrowserRouter>
            </PlatformContext.Provider>
        );

        expect(screen.getByText(/your personal details are missing/i)).toBeInTheDocument();
        expect(
            screen.getByText(/please complete your personal details before you verify your identity\./i)
        ).toBeInTheDocument();
        expect(screen.getByText('IcAccountMissingDetails')).toBeInTheDocument();

        const btn = screen.getByRole('link', { name: /go to personal details/i });
        expect(btn).toBeInTheDocument();
        expect(btn.hasAttribute('href'));
        expect(btn.hasAttribute('/account/personal-details'));
    });
});
