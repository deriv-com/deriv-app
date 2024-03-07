import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInputField } from '../FormInputField';

describe('FormInputField', () => {
    it('should render the Input field', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <FormInputField label='testField' name='testField' />
                </Form>
            </Formik>
        );

        // Assert that the input field is rendered
        const inputField = screen.getByLabelText('testField');
        expect(inputField).toBeInTheDocument();
    });

    it('should update the field value when user types', () => {
        let formValues = { testField: '' };
        render(
            <Formik initialValues={{ testField: '' }} onSubmit={jest.fn()}>
                {({ values }) => {
                    formValues = values;
                    return (
                        <Form>
                            <FormInputField label='testField' name='testField' />
                        </Form>
                    );
                }}
            </Formik>
        );

        // Select an option from the input
        const inputField = screen.getByLabelText('testField');
        userEvent.type(inputField, 'value 1');

        // Assert that the field value is updated
        expect(formValues.testField).toEqual('value 1');
    });

    it('should render error message when input is invalid', async () => {
        const formValues = { testField: '' };
        const mockValidationSchema = Yup.object({
            testField: Yup.string().required('This field is required'),
        });

        render(
            <Formik initialValues={formValues} onSubmit={jest.fn()} validationSchema={mockValidationSchema}>
                <FormInputField label='testField' name='testField' />
            </Formik>
        );

        const inputField = screen.getByLabelText('testField');

        userEvent.type(inputField, 'value 1');
        userEvent.clear(inputField);

        fireEvent.blur(inputField);

        expect(await screen.findByText('This field is required')).toBeVisible();
    });

    it('should throw error when FormInputField is not wrapped with Formik', () => {
        expect(() => render(<FormInputField label='testField' name='testField' />)).toThrowError();
    });
});
