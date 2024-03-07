import React from 'react';
import { Form, Formik } from 'formik';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDropDownField } from '../FormDropDownField';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('FormDropDownField', () => {
    it('should render the dropdown field', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <FormDropDownField list={[]} name='testField' />
                </Form>
            </Formik>
        );

        // Assert that the dropdown field is rendered
        const dropdownField = screen.getByRole('combobox');
        expect(dropdownField).toBeInTheDocument();
    });

    it('should update the field value when an option is selected', () => {
        let formValues = { testField: '' };
        render(
            <Formik initialValues={{ testField: '' }} onSubmit={jest.fn()}>
                {({ values }) => {
                    formValues = values;
                    return (
                        <Form>
                            <FormDropDownField list={[{ text: 'sum1', value: 'sum1' }]} name='testField' />
                        </Form>
                    );
                }}
            </Formik>
        );

        // Select an option from the dropdown
        const dropdownField = screen.getByRole('combobox');
        userEvent.click(dropdownField);
        const option = screen.getByText('sum1');
        userEvent.click(option);

        // Assert that the field value is updated
        expect(formValues.testField).toEqual('sum1');
    });

    it('should not allow values in input when isMobile flag is true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            <Formik initialValues={{ testField: '' }} onSubmit={jest.fn()}>
                <Form>
                    <FormDropDownField list={[{ text: 'sum1', value: 'sum1' }]} name='testField' />
                </Form>
            </Formik>
        );

        const dropdownField = screen.getByRole('combobox');
        userEvent.type(dropdownField, 'su');
        expect(dropdownField).toHaveValue('');
    });
});
