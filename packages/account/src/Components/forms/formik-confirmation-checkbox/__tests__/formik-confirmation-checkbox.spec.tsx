import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationCheckbox } from '../formik-confirmation-checkbox';
import { Formik, Form } from 'formik';

describe('ConfirmationCheckbox', () => {
    const props: React.ComponentProps<typeof ConfirmationCheckbox> = {
        confirmed: true,
        setConfirmed: jest.fn(),
        label: 'I confirm my details are correct.',
    };

    test('renders checkbox with label', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <ConfirmationCheckbox {...props} />
                </Form>
            </Formik>
        );

        const checkbox = screen.getByLabelText('I confirm my details are correct.');
        expect(checkbox).toBeInTheDocument();
    });

    test('calls setConfirmed function when checkbox is clicked', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <Form>
                    <ConfirmationCheckbox {...props} />
                </Form>
            </Formik>
        );

        const checkbox = screen.getByLabelText('I confirm my details are correct.');
        fireEvent.click(checkbox);

        expect(props.setConfirmed).toHaveBeenCalledTimes(1);
    });
});
