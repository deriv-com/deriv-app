import React from 'react';
import { Form, Formik } from 'formik';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { FinancialAssessmentFields } from '../FinancialAssessmentFields';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

// jest.mock('../../../components/FormFields/', () => ({
//     ...jest.requireActual('../../../components/FormFields'),
//     FormDropDownField: jest.fn(() => <div data-testid='dt_dropdown' />),
// }));

const initialValues = {
    accountTurnover: '',
    educationLevel: '',
    employmentIndustry: '',
    employmentStatus: '',
    estimatedWorth: '',
    incomeSource: '',
    netIncome: '',
    occupation: '',
    sourceOfWealth: '',
};

describe('FinancialAssessmentFields', () => {
    it('renders all form fields', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <Formik initialValues={initialValues} onSubmit={jest.fn()}>
                        <Form>
                            <FinancialAssessmentFields />;
                        </Form>
                    </Formik>
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByRole('combobox', { name: 'Source of income' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Employment status' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Industry of employment' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Occupation' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Source of wealth' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Level of education' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Net annual income' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Estimated net worth' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Anticipated account turnover' })).toBeInTheDocument();
    });

    it('throw error if not wrapped with Formik ', () => {
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
        jest.spyOn(console, 'warn').mockImplementation(() => jest.fn());
        expect(() =>
            render(
                <APIProvider>
                    <AuthProvider>
                        <FinancialAssessmentFields />
                    </AuthProvider>
                </APIProvider>
            )
        ).toThrow('FinancialAssessmentFields must be used within a Formik component');
        jest.restoreAllMocks();
    });
});
