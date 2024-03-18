import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider, useActiveTradingAccount, useAuthentication } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { AUTH_STATUS_CODES } from '../../../constants/constants';
import { SupportProfessionalClient } from '../SupportProfessionalClient';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveTradingAccount: jest.fn(),
    useAuthentication: jest.fn(),
}));

beforeEach(() => {
    (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    (useAuthentication as jest.Mock).mockReturnValue({
        data: { poa_status: AUTH_STATUS_CODES.NONE, poi_status: AUTH_STATUS_CODES.NONE },
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

    const description1 =
        'By default, all Deriv.com clients are retail clients but anyone can request to be treated as a professional client.';
    const description2 = 'A professional client receives a lower degree of client protection due to the following.';
    const description3 =
        'We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved.';
    const description4 =
        'We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings.';

    const professionalClientDescriptions = [description1, description2, description3, description4];

    it('should render SupportProfessionalClient component', () => {
        renderComponent(<SupportProfessionalClient />);
        professionalClientDescriptions.forEach(professionalClientDescription =>
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
        (useAuthentication as jest.Mock).mockReturnValue({
            data: { poa_status: AUTH_STATUS_CODES.VERIFIED, poi_status: AUTH_STATUS_CODES.VERIFIED },
        });
        renderComponent(<SupportProfessionalClient />);
        expect(
            screen.getByRole('checkbox', { name: 'I would like to be treated as a professional client.' })
        ).toBeInTheDocument();
    });

    it('should disable checkbox if isVirtual account', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            data: { poa_status: AUTH_STATUS_CODES.VERIFIED, poi_status: AUTH_STATUS_CODES.VERIFIED },
        });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        renderComponent(<SupportProfessionalClient />);
        const checkbox = screen.getByRole('checkbox', { name: 'I would like to be treated as a professional client.' });
        expect(checkbox).toBeDisabled();
    });
});
