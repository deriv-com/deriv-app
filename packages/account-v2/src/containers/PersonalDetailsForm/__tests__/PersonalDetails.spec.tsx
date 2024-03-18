import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider, useActiveTradingAccount, useGetAccountStatus, useSettings } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { PersonalDetails } from '../PersonalDetails';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveTradingAccount: jest.fn(),
    useGetAccountStatus: jest.fn(),
    useSettings: jest.fn(),
}));

beforeEach(() => {
    (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    (useGetAccountStatus as jest.Mock).mockReturnValue({ data: { status: [] } });
    (useSettings as jest.Mock).mockReturnValue({ data: { immutable_fields: [] } });
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

    const inputFieldNames = ['Date of birth*', 'First name*', 'Last name*', 'Phone*'];

    it('should render PersonalDetails', () => {
        renderComponent(<PersonalDetails />);
        inputFieldNames.forEach(inputFieldName =>
            expect(screen.getByRole('textbox', { name: inputFieldName })).toBeInTheDocument()
        );
        expect(screen.queryByRole('textbox', { name: 'Email address*' })).not.toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Place of birth' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Country of residence*' })).toBeInTheDocument();
    });

    it('should only render residence input field if isVirtual is true', () => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        renderComponent(<PersonalDetails />);
        inputFieldNames.forEach(inputFieldName =>
            expect(screen.queryByRole('textbox', { name: inputFieldName })).not.toBeInTheDocument()
        );
        expect(screen.queryByRole('combobox', { name: 'Place of birth' })).not.toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Country of residence*' })).toBeInTheDocument();
    });

    it('should render email input field if isSocialSignup is true', () => {
        (useGetAccountStatus as jest.Mock).mockReturnValue({ data: { status: ['social_signup'] } });
        renderComponent(<PersonalDetails />);
        expect(screen.getByRole('textbox', { name: 'Email address*' })).toBeInTheDocument();
    });

    it('firstName input field should be disabled if immutable_fields includes first_name', () => {
        (useSettings as jest.Mock).mockReturnValue({ data: { immutable_fields: ['first_name'] } });
        renderComponent(<PersonalDetails />);
        const firstNameInputField = screen.getByRole('textbox', { name: 'First name*' });
        expect(firstNameInputField).toBeDisabled();
    });
});
