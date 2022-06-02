import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
                phone_idd: '355',
                text: 'Albania',
                tin_format: ['^[A-Ta-t0-9]\\d{8}[A-Wa-w]$'],
                value: 'al',
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
        expect(
            screen.getByText(
                /any information you provide is confidential and will be used for verification purposes only\./i
            )
        ).toBeInTheDocument();
        expect(screen.getAllByText('FormSubHeader').length).toBe(3);
        expect(
            screen.getByRole('textbox', {
                name: /citizenship/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', {
                name: /tax residence/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('textbox', {
                name: /tax identification number/i,
            })
        ).toBeInTheDocument();
        expect(screen.getByText(/account opening reason/i)).toBeInTheDocument();
    });

    it("should show that it's loading when is_loading is true", () => {
        const { container } = render(<CFDPersonalDetailsForm {...props} is_loading />);
        expect(container.querySelector('.initial-loader')).toBeInTheDocument();
    });

    it('should show an error message and icon if there is a form error received from server', () => {
        render(<CFDPersonalDetailsForm {...props} form_error='Request Processing Error' />);
        expect(screen.getByTestId('form-submit-error')).toHaveClass('dc-icon');
        expect(screen.getByText('Request Processing Error')).toBeInTheDocument();
    });

    it('should disable the Next button in case of erroneous input in a required field', async () => {
        render(<CFDPersonalDetailsForm {...props} />);
        expect(
            screen.getByText(
                /any information you provide is confidential and will be used for verification purposes only\./i
            )
        ).toBeInTheDocument();
        const tax_id_input = screen.getByRole('textbox', {
            name: /tax identification number/i,
        });
        const next_button = screen.getByRole('button', {
            name: /next/i,
        });
        fireEvent.change(tax_id_input, { target: { value: 'invalid_text_id_0' } });
        fireEvent.focusOut(tax_id_input);
        await waitFor(() => expect(next_button).toBeDisabled());
    });
});
