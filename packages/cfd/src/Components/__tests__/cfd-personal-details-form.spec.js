import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import CFDPersonalDetailsForm from '../cfd-personal-details-form';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FormSubHeader: () => <div>FormSubHeader</div>,
}));

describe('<CFDPersonalDetailsForm />', () => {
    beforeAll(() => (ReactDOM.createPortal = jest.fn(component => component)));
    afterAll(() => ReactDOM.createPortal.mockClear());

    const props = {
        form_error: undefined,
        index: 0,
        is_fully_authenticated: false,
        is_loading: false,
        landing_company: {
            config: {
                tax_details_required: 1,
                tin_format: ['^\\d{15}$'],
                tin_format_description: '999999999999999',
            },
            dxtrade_financial_company: {},
            dxtrade_gaming_company: {},
            financial_company: {},
            gaming_company: {},
            id: 'id',
            minimum_age: 18,
            mt_financial_company: {},
            mt_gaming_company: {},
            name: 'Indonesia',
            virtual_company: 'virtual',
        },
        onCancel: jest.fn(),
        onSave: jest.fn(),
        onSubmit: jest.fn(),
        residence_list: [
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                driving_licence: {
                                    display_name: 'Driving Licence',
                                },
                                national_identity_card: {
                                    display_name: 'National Identity Card',
                                },
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '62',
                text: 'Indonesia',
                tin_format: ['^\\d{15}$'],
                value: 'id',
            },
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {},
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '35818',
                text: 'Aland Islands',
                value: 'ax',
            },
        ],
        value: {
            citizen: '',
            tax_residence: '',
            tax_identification_number: '',
            account_opening_reason: '',
        },
    };

    it('should render properly', () => {
        render(<CFDPersonalDetailsForm {...props} />);
        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const tax_residence = screen.getByRole('textbox', { name: /tax residence/i });
        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });
        const account_opening_reason = screen.getByText(/account opening reason/i);
        const next_button = screen.getByRole('button', { name: /next/i });

        expect(
            screen.getByText(
                /any information you provide is confidential and will be used for verification purposes only\./i
            )
        ).toBeInTheDocument();
        expect(screen.getAllByText('FormSubHeader').length).toBe(3);
        expect(citizenship_input).toBeInTheDocument();
        expect(tax_residence).toBeInTheDocument();
        expect(tax_id_input).toBeInTheDocument();
        expect(account_opening_reason).toBeInTheDocument();
        expect(next_button).toBeEnabled();
    });

    it("should show that it's loading when is_loading is true", () => {
        const { container } = render(<CFDPersonalDetailsForm {...props} is_loading />);
        expect(container.querySelector('.initial-loader')).toBeInTheDocument();
    });

    it('should show an error message and icon if there is a general form error', () => {
        render(<CFDPersonalDetailsForm {...props} form_error='Form submission failed.' />);
        expect(screen.getByTestId('form-submit-error')).toHaveClass('dc-icon');
        expect(screen.getByText('Form submission failed.')).toBeInTheDocument();
    });

    it('should enable the Next button in case of all required fields are filled', async () => {
        render(<CFDPersonalDetailsForm {...props} />);

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const tax_residence = screen.getByRole('textbox', { name: /tax residence/i });
        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });
        const account_opening_reason = screen.getByText(/account opening reason/i);
        const next_button = screen.getByRole('button', { name: /next/i });

        const citizenship_error = 'Citizenship is required';
        const tax_residence_error = 'Tax residence is required';
        const tax_id_error = 'Tax identification number is required';
        const account_opening_reason_error = 'Account opening reason is required';

        fireEvent.change(citizenship_input, { target: { value: 'Indonesia' } });
        fireEvent.click(next_button);
        await waitFor(() => {
            expect(screen.queryByText(citizenship_error)).not.toBeInTheDocument();
            expect(screen.getByText(tax_residence_error)).toBeInTheDocument();
            expect(screen.getByText(tax_id_error)).toBeInTheDocument();
            expect(screen.getByText(account_opening_reason_error)).toBeInTheDocument();
            expect(next_button).toBeDisabled();
        });

        fireEvent.change(tax_residence, { target: { value: 'Indonesia' } });
        fireEvent.click(next_button);
        await waitFor(() => {
            expect(screen.queryByText(citizenship_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_residence_error)).not.toBeInTheDocument();
            expect(screen.getByText(tax_id_error)).toBeInTheDocument();
            expect(screen.getByText(account_opening_reason_error)).toBeInTheDocument();
            expect(next_button).toBeDisabled();
        });

        fireEvent.change(tax_id_input, { target: { value: '023124224563456' } });
        fireEvent.click(next_button);
        await waitFor(() => {
            expect(screen.queryByText(citizenship_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_residence_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_id_error)).not.toBeInTheDocument();
            expect(screen.getByText(account_opening_reason_error)).toBeInTheDocument();
            expect(next_button).toBeDisabled();
        });

        fireEvent.click(account_opening_reason);
        const hedging = within(screen.getByRole('list')).getByText('Hedging');
        fireEvent.click(hedging);
        fireEvent.click(account_opening_reason);
        await waitFor(() => {
            expect(screen.queryByText(citizenship_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_residence_error)).not.toBeInTheDocument();
            expect(screen.queryByText(tax_id_error)).not.toBeInTheDocument();
            expect(screen.queryByText(account_opening_reason_error)).not.toBeInTheDocument();
            expect(next_button).toBeEnabled();
        });

        fireEvent.click(next_button);
        await waitFor(() => {
            expect(props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('should disable the Next button in case of erroneous input in a required field', async () => {
        render(<CFDPersonalDetailsForm {...props} />);

        const tax_id_input = screen.getByRole('textbox', { name: /tax identification number/i });
        const next_button = screen.getByRole('button', { name: /next/i });

        fireEvent.change(tax_id_input, { target: { value: 'invalid_text_id_0' } });
        fireEvent.click(next_button);

        await waitFor(() => {
            expect(next_button).toBeDisabled();
            expect(screen.getByText('Tax identification number is not properly formatted.')).toBeInTheDocument();
        });
    });

    it('should disable the Next button in case of an empty input in a required field', async () => {
        render(<CFDPersonalDetailsForm {...props} />);

        const citizenship_input = screen.getByRole('textbox', { name: /citizenship/i });
        const next_button = screen.getByRole('button', { name: /next/i });

        fireEvent.change(citizenship_input, { target: { value: '' } });
        fireEvent.click(next_button);

        await waitFor(() => {
            expect(next_button).toBeDisabled();
            expect(screen.getByText('Citizenship is required')).toBeInTheDocument();
        });
    });
});
