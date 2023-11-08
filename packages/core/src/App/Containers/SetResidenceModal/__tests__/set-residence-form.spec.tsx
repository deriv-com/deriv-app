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
    const mock_props = {
        class_prefix: 'set-residence',
        errors: { residence: [] },
        touched: { residence: '' },
        residence_list: [],
    };
    it('should render the component with autocomplete input box', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...mock_props} />
            </Formik>
        );
        expect(screen.getByText('mockedAutocomplete')).toBeInTheDocument();
    });

    it('should not display the hint text if there are errors', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...{ ...mock_props, errors: { residence: ['error1'] } }} />
            </Formik>
        );
        expect(screen.queryByText('Select the country where you currently live.')).not.toBeInTheDocument();
    });

    it('should display the hint text if there are no errors', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => Promise.resolve()}>
                <SetResidenceForm {...mock_props} />
            </Formik>
        );
        expect(screen.getByText('Select the country where you currently live.')).toBeInTheDocument();
    });
});
