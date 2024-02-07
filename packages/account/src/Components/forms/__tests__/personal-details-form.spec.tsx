import React from 'react';
import { Formik } from 'formik';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PersonalDetailsForm from '../personal-details-form';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: () => <div>Mocked Link Component</div>,
}));

describe('PersonalDetailsForm', () => {
    const mock_props = {
        editable_fields: ['salutation', 'first_name', 'last_name'],
        salutation_list: [
            { value: 'Mr', label: 'Mr' },
            { value: 'Ms', label: 'Ms' },
        ],
    };

    const renderComponent = () => {
        render(
            <Formik initialValues={{ salutation: '' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...mock_props} />
            </Formik>
        );
    };

    it("should display the salutations 'Mr' and 'Ms' on screen", () => {
        renderComponent();

        expect(screen.getByRole('radio', { name: 'Mr' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Ms' })).toBeInTheDocument();
    });

    it('should select the respective salutation when radio button is clicked', () => {
        renderComponent();

        const mr_radio_input = screen.getByRole('radio', { name: 'Mr' });
        const ms_radio_input = screen.getByRole('radio', { name: 'Ms' });

        expect(mr_radio_input).not.toBeChecked();
        expect(ms_radio_input).not.toBeChecked();

        userEvent.click(mr_radio_input);
        expect(mr_radio_input).toBeChecked();
        expect(ms_radio_input).not.toBeChecked();

        userEvent.click(ms_radio_input);
        expect(mr_radio_input).not.toBeChecked();
        expect(ms_radio_input).toBeChecked();
    });

    it('should display crs confirmation checkbox if tax residence & tin fields are filled', () => {
        render(
            <Formik
                initialValues={{ tax_residence: '', tax_identification_number: '', crs_confirmation: false }}
                onSubmit={jest.fn()}
            >
                <PersonalDetailsForm is_svg />
            </Formik>
        );

        fireEvent.change(screen.getByTestId('tax_residence'), { target: { value: 'Afghanistan' } });
        fireEvent.change(screen.getByTestId('tax_identification_number'), { target: { value: '1234567890' } });

        expect(
            screen.queryByLabelText(/i confirm that my tax information is accurate and complete/i)
        ).toBeInTheDocument();
    });

    it('should disable First name field is POI is attempted', () => {
        const props = {
            ...mock_props,
            has_real_account: true,
            account_status: {
                authentication: {
                    identity: {
                        status: 'pending',
                    },
                },
            },
        };
        render(
            <Formik initialValues={{ first_name: 'demo' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...props} />
            </Formik>
        );

        const el_first_name = screen.getByTestId('first_name');
        expect(el_first_name).toBeDisabled();
    });

    it('should enable First name field is POI is not attempted', () => {
        const props = {
            ...mock_props,
            has_real_account: true,
            account_status: {
                authentication: {
                    identity: {
                        status: 'none',
                    },
                },
            },
        };
        render(
            <Formik initialValues={{ first_name: '' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...props} />
            </Formik>
        );

        const el_first_name = screen.getByTestId('first_name');
        expect(el_first_name).toBeEnabled();
    });

    it('should enable Last name field is POI is attempted', () => {
        const props = {
            ...mock_props,
            account_status: {
                authentication: {
                    identity: {
                        status: 'none',
                    },
                },
            },
        };
        render(
            <Formik initialValues={{ last_name: '' }} onSubmit={jest.fn()}>
                <PersonalDetailsForm {...props} />
            </Formik>
        );

        const el_last_name = screen.getByTestId('last_name');
        expect(el_last_name).toBeEnabled();
    });
});
