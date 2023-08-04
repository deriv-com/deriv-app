import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import SetResidenceForm from '../set-residence-form';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Autocomplete: jest.fn(() => 'mockedAutocomplete'),
    };
});
describe('SetResidenceForm', () => {
    it('should render the component', () => {
        const mock_props = {
            class_prefix: 'set-residence',
            errors: { residence: [] },
            touched: { residence: '' },
            residence_list: [],
        };
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...mock_props} />
            </Formik>
        );
    });

    it('should not display the hint text if there are errors', () => {
        const mock_props = {
            class_prefix: 'set-residence',
            errors: { residence: ['error1'] },
            touched: { residence: '' },
            residence_list: [],
        };
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...mock_props} />
            </Formik>
        );
        expect(screen.queryByText('Country of residence is where you currently live.')).not.toBeInTheDocument();
    });

    it('should display the hint text if there are no errors', () => {
        const mock_props = {
            class_prefix: 'set-residence',
            errors: { residence: [] },
            touched: { residence: '' },
            residence_list: [],
        };
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...mock_props} />
            </Formik>
        );
        expect(screen.queryByText('Country of residence is where you currently live.')).toBeInTheDocument();
    });
});
