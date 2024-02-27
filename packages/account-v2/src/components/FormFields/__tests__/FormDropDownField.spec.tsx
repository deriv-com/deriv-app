import React from 'react';
import { Form, Formik } from 'formik';
import { useBreakpoint } from '@deriv/quill-design';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormDropDownField from '../FormDropDownField';

jest.mock('@deriv/quill-design', () => ({
    useBreakpoint: jest.fn(() => ({ isMobile: false })),
}));

describe('FormDropDownField', () => {
    it('should render the dropdown field', () => {
        render(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <Formik initialValues={{}} onSubmit={() => {}}>
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
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

    it('should make input readonly when isMobile', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: true });
        render(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                <Form>
                    <FormDropDownField list={[{ text: 'sum1', value: 'sum1' }]} name='testField' />
                </Form>
            </Formik>
        );

        // Select an option from the dropdown
        const dropdownField = screen.getByRole('combobox');
        userEvent.type(dropdownField, 'sum23');

        // Assert that the field value is updated
        expect(dropdownField).toHaveValue('');
    });
});
