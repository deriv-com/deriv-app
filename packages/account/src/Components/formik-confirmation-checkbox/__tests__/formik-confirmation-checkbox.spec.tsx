import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormikConfirmationCheckbox from '../formik-confirmation-checkbox';
import { Formik, Form } from 'formik'; // Import Formik and Form
import { StoreProvider, mockStore } from '@deriv/stores';

describe('ConfirmationCheckbox', () => {
    test('renders checkbox with label', () => {
        const props = {
            confirmed: true,
            setConfirmed: jest.fn(),
            label: 'I confirm my details are correct.',
        };

        render(
            <StoreProvider store={mockStore({})}>
                <Formik initialValues={{}} onSubmit={jest.fn()}>
                    <Form>
                        <FormikConfirmationCheckbox {...props} />
                    </Form>
                </Formik>
            </StoreProvider>
        );

        const checkbox = screen.getByLabelText('I confirm my details are correct.');
        expect(checkbox).toBeInTheDocument();
    });

    test('calls setConfirmed function when checkbox is clicked', () => {
        const setConfirmedMock = jest.fn();
        const props = {
            confirmed: true,
            setConfirmed: setConfirmedMock,
            label: 'I confirm my details are correct.',
        };

        render(
            <StoreProvider store={mockStore({})}>
                <Formik initialValues={{}} onSubmit={jest.fn()}>
                    <Form>
                        <FormikConfirmationCheckbox {...props} />
                    </Form>
                </Formik>
            </StoreProvider>
        );

        const checkbox = screen.getByLabelText('I confirm my details are correct.');
        fireEvent.click(checkbox);

        expect(setConfirmedMock).toHaveBeenCalledTimes(1);
    });
});
