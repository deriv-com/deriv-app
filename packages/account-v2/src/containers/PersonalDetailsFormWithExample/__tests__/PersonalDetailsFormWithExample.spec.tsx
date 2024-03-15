import React from 'react';
import { Formik } from 'formik';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
            <PersonalDetailsFormWithExample onConfirm={jest.fn()} />
        </Formik>
    );
};

describe('PersonalDetailsFormWithExample', () => {
    it('should render the PersonalDetailsFormWithExample component', () => {
        renderComponent();

        expect(screen.getAllByRole('textbox')).toHaveLength(3);
        expect(screen.getByRole('checkbox')).toBeValid();
    });

    it('should disable the checkbox when the form is not filled', () => {
        renderComponent();

        const checkbox = screen.getByRole('checkbox');

        expect(checkbox).toBeDisabled();
    });

    it('should enable the checkbox when the form is filled', async () => {
        renderComponent();

        const elCheckbox = screen.getByRole('checkbox');
        const elFirstname = screen.getByRole('textbox', { name: /first name*/i });
        const elLastname = screen.getByRole('textbox', { name: /last name*/i });
        const elDob = screen.getByRole('textbox', { name: /date of birth*/i });

        expect(elCheckbox).toBeDisabled();

        userEvent.type(elFirstname, 'John');
        userEvent.type(elLastname, 'Doe');
        userEvent.type(elDob, '01/01/1990');

        await waitFor(() => {
            expect(elCheckbox).toBeEnabled();
        });
    });

    it('should display initial hint messages for the input fields', () => {
        renderComponent();

        expect(screen.getByText(/your first name as in your identity document/i)).toBeVisible();
        expect(screen.getByText(/your last name as in your identity document/i)).toBeVisible();
        // [TODO]: Enable the below line once DatePicker can render hint message and error message
        // expect(screen.getByText(/your date of birth as in your identity document/i)).toBeVisible();
    });

    it('should display error message when incorrect value is filled for First name', async () => {
        renderComponent();

        const elFirstname = screen.getByRole('textbox', { name: /first name*/i });

        userEvent.type(elFirstname, '123');
        fireEvent.blur(elFirstname);

        await waitFor(() => {
            expect(screen.getByText(/Letters, spaces, periods, hyphens, apostrophes only./i)).toBeVisible();
        });

        userEvent.clear(elFirstname);
        fireEvent.blur(elFirstname);

        await waitFor(() => {
            expect(screen.getByText(/First name is required./i)).toBeVisible();
        });
    });

    it('should display error message when incorrect value is filled for Last name', async () => {
        renderComponent();

        const elLastname = screen.getByRole('textbox', { name: /last name*/i });

        userEvent.type(elLastname, '123');
        fireEvent.blur(elLastname);

        await waitFor(() => {
            expect(screen.getByText(/Letters, spaces, periods, hyphens, apostrophes only./i)).toBeVisible();
        });

        userEvent.clear(elLastname);
        fireEvent.blur(elLastname);

        await waitFor(() => {
            expect(screen.getByText(/last name is required./i)).toBeVisible();
        });
    });
});
