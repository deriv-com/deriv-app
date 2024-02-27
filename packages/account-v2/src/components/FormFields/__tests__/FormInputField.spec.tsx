import React from 'react';
import { Form, Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInputField from '../FormInputField';

describe('FormInputField', () => {
    it('should render the Input field', () => {
        render(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <Formik initialValues={{}} onSubmit={() => {}}>
                <Form>
                    <FormInputField label='testField' name='testField' />
                </Form>
            </Formik>
        );

        // Assert that the input field is rendered
        const inputField = screen.getByTestId('dt_wallets_textfield_box');
        expect(inputField).toBeInTheDocument();
    });

    it('should update the field value when user types', () => {
        let formValues = { testField: '' };
        render(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
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
});
