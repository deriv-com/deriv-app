import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import EmploymentTaxDetailsContainer from '../employment-tax-details-container';

describe('Testing <EmploymentTaxDetailsContainer/> component', () => {
    it('should render EmploymentTaxDetailsContainer component', () => {
        const props: React.ComponentProps<typeof EmploymentTaxDetailsContainer> = {
            editable_fields: [],
            parent_ref: { current: document.createElement('div') },
            handleChange: jest.fn(),
            tin_validation_config: {
                is_tin_mandatory: false,
                tin_employment_status_bypass: [],
            },
        };
        render(
            <APIProvider>
                <Formik initialValues={{}} onSubmit={jest.fn()}>
                    <EmploymentTaxDetailsContainer {...props} />
                </Formik>
            </APIProvider>
        );

        expect(screen.getByText(/Employment status/)).toBeInTheDocument;
        expect(screen.getByText(/Tax residence/)).toBeInTheDocument;
        expect(screen.getByText(/Tax identification number/)).toBeInTheDocument;
        expect(screen.getByText(/I confirm that my tax information is accurate and complete./)).toBeInTheDocument;
    });
});
