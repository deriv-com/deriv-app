import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { supportProfessionalClientInfo } from '../../../constants/supportProfessionalClientConstants';
import { usePersonalDetails } from '../../../hooks/usePersonalDetails';
import { SupportProfessionalClient } from '../SupportProfessionalClient';

jest.mock('../../../hooks/usePersonalDetails', () => ({
    ...jest.requireActual('../../../hooks/usePersonalDetails'),
    usePersonalDetails: jest.fn(),
}));

beforeEach(() => {
    (usePersonalDetails as jest.Mock).mockReturnValue({
        accountAuthStatus: { isAccountVerified: false },
        data: { isVirtual: false },
    });
});

describe('PersonalDetails', () => {
    const renderComponent = (children: React.ReactNode) => {
        render(
            <APIProvider>
                <AuthProvider>
                    <Formik initialValues={{}} onSubmit={jest.fn()}>
                        <Form>{children}</Form>
                    </Formik>
                </AuthProvider>
            </APIProvider>
        );
    };

    it('should render SupportProfessionalClient component', () => {
        renderComponent(<SupportProfessionalClient />);
        supportProfessionalClientInfo.forEach(professionalClientDescription =>
            expect(screen.getByText(professionalClientDescription)).toBeInTheDocument()
        );
    });

    it('should render infoBox component if client account is not verified', () => {
        renderComponent(<SupportProfessionalClient />);
        expect(
            screen.getByText(
                'You’ll need to authenticate your account before requesting to become a professional client.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Authenticate my account')).toBeInTheDocument();
    });

    it('should render checkbox if client account is verified', () => {
        (usePersonalDetails as jest.Mock).mockReturnValue({
            accountAuthStatus: { isAccountVerified: true },
            data: { isVirtual: false },
        });
        renderComponent(<SupportProfessionalClient />);
        expect(
            screen.getByRole('checkbox', { name: 'I would like to be treated as a professional client.' })
        ).toBeInTheDocument();
    });

    it('should disable checkbox if isVirtual account', () => {
        (usePersonalDetails as jest.Mock).mockReturnValue({
            accountAuthStatus: { isAccountVerified: true },
            data: { isVirtual: true },
        });
        renderComponent(<SupportProfessionalClient />);
        const checkbox = screen.getByRole('checkbox', { name: 'I would like to be treated as a professional client.' });
        expect(checkbox).toBeDisabled();
    });
});
