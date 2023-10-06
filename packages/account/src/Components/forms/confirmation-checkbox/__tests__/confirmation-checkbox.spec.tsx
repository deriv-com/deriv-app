import React from 'react';
import { Form, Formik } from 'formik';

import { render, screen } from '@testing-library/react';

import { ConfirmationCheckbox } from '../confirmation-checkbox';

describe('ConfirmationCheckbox', () => {
    const props: React.ComponentProps<typeof ConfirmationCheckbox> = {
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
});
