import React from 'react';
import { Formik } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import { getNameDOBValidationSchema } from '../../../utils/personal-details-utils';
import { PersonalDetailsFormWithExample } from '../PersonalDetailsFormWithExample';

jest.mock('../../../assets/proof-of-identity/personal-details-example.svg', () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div>MockedLazyComponent</div>),
    };
});

const renderComponent = () => {
    return render(
        <Formik initialValues={{}} onSubmit={jest.fn()} validationSchema={getNameDOBValidationSchema()}>
            <PersonalDetailsFormWithExample />
        </Formik>
    );
};

describe('PersonalDetailsFormWithExample', () => {
    it('should render the PersonalDetailsFormWithExample component', () => {
        renderComponent();

        expect(screen.getAllByRole('textbox')).toHaveLength(3);
        expect(screen.getByRole('checkbox')).toBeValid();
    });

    it('should disable the checkbox when the form is not filled', async () => {
        renderComponent();

        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();

        await waitFor(() => {
            expect(checkbox).toBeDisabled();
        });
    });
});
