import React from 'react';
import { Form, Formik } from 'formik';
import * as formik from 'formik';
import { APIProvider, AuthProvider, useSettings } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { TaxInformation } from '../TaxInformation';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useSettings: jest.fn(),
}));

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

beforeEach(() => {
    mockUseFormikContext.mockReturnValue({
        values: {},
    });
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

    it('should render TaxInformationComponent', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                employmentStatus: 'Yes',
                taxIdentificationNumber: '123456789',
                taxResidence: 'Indonesia',
            },
        });
        renderComponent(<TaxInformation />);
        expect(screen.getByRole('combobox', { name: 'Tax residence*' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Employment status' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Tax identification number*' })).toBeInTheDocument();
    });

    it('should not render TaxInformationComponent if value is empty', () => {
        renderComponent(<TaxInformation />);
        expect(screen.queryByRole('combobox', { name: 'Tax residence*' })).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox', { name: 'Employment status' })).not.toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'Tax identification number*' })).not.toBeInTheDocument();
    });
});
