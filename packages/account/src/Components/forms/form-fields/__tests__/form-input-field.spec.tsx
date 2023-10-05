import React from 'react';
import { Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import FormInputField from '../form-input-field';

describe('Tesing <FormInputField/> component', () => {
    it('should render properties', () => {
        const props: React.ComponentProps<typeof FormInputField> = {
            name: 'test-name',
            required: true,
        };
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <FormInputField {...props} />
            </Formik>
        );

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render Input field with optional status', () => {
        const props = {
            name: 'test-name',
        };
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <FormInputField {...props} />
            </Formik>
        );

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).not.toBeRequired();
    });
});
