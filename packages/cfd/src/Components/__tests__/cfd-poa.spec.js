import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CFDPOA from '../cfd-poa';

const poa_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FileUploaderContainer: () => <div>FileUploaderContainer</div>,
    FormSubHeader: jest.fn(props => <div>{props.title}</div>),
    PoaStatusCodes: jest.fn(() => {
        poa_status_codes.verified;
    }),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const form_state = {
        poa_status: 'verified',
        resubmit_poa: false,
        has_poi: false,
        form_error: '',
    };
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
        useStateCallback: jest.fn(() => [
            jest.fn(() => form_state),
            jest.fn((form_state, cb) => {
                cb();
            }),
        ]),
    };
});

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            getAccountStatus: jest.fn().mockResolvedValue({
                get_account_status: {
                    authentication: {
                        document: {
                            status: 'verified',
                        },
                        identity: {
                            status: 'verified',
                        },
                    },
                },
            }),
        },
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
}));

describe('<CFDPOA />', () => {
    const address = {
        address_line_1: 'First line of address*',
        address_line_2: 'Second line of address',
        address_postcode: 'Postal/ZIP code',
        address_state: 'State/Province',
        address_town: 'Town/City*',
    };

    let props;

    beforeEach(() => {
        props = {
            onSave: jest.fn(),
            index: 1,
            onSubmit: jest.fn(),
            refreshNotifications: jest.fn(),
            form_error: '',
            get_settings: {
                account_opening_reason: '',
                address_city: 'Woodlands',
                address_line_1: "69 Test Street, .'",
                address_line_2: ".'",
                address_postcode: '666',
                address_state: '',
                allow_copiers: 0,
                citizen: '',
                client_tnc_status: 'Version 4.2.0 2020-08-07',
                country: 'Singapore',
                country_code: 'sg',
                date_of_birth: 984960000,
                email: 'mock@gmail.com',
                email_consent: 1,
                feature_flag: {
                    wallet: 0,
                },
                first_name: 'thisyahlen',
                has_secret_answer: 1,
                immutable_fields: ['residence'],
                is_authenticated_payment_agent: 0,
                last_name: 'lol',
                non_pep_declaration: 1,
                phone: '+790875616',
                place_of_birth: null,
                preferred_language: 'EN',
                request_professional_status: 0,
                residence: 'Singapore',
                salutation: '',
                tax_identification_number: null,
                tax_residence: null,
                user_hash: '823341c18bfccb391b6bb5d77ab7e6a83991f82669c1ba4e5b01dbd2fd71c7fe',
            },
            height: 'auto',
            is_loading: false,
            states_list: {
                text: 'Central Singapore',
                value: '01',
            },
            storeProofOfAddress: jest.fn(),
            value: {
                address_city: '',
                address_line_1: '',
                address_line_2: '',
                address_postcode: '',
                address_state: 'Default test state',
            },
        };
    });

    it('should render the POA component with the correct texts and buttons', async () => {
        render(<CFDPOA {...props} />);

        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        expect(screen.getByText(/First line of address*/i)).toBeInTheDocument();
        expect(screen.getByText(/Second line of address \(optional\)/i)).toBeInTheDocument();
        expect(screen.getByText('Town/City*')).toBeInTheDocument();
        expect(screen.getByText('State/Province')).toBeInTheDocument();
        expect(screen.getByText('Postal/ZIP code')).toBeInTheDocument();
        expect(screen.getByText(/FileUploaderContainer/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });
    it('should render the correct input for all the fields and enable the submit button ', async () => {
        render(<CFDPOA {...props} />);

        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        const address_line_1_input = screen.getByPlaceholderText(address.address_line_1);
        const first_line_address_text = 'Test first line address';
        expect(address_line_1_input.value).toBe('');

        const address_line_2_input = screen.getByPlaceholderText(address.address_line_2);
        const second_line_address_text = 'Test second line address';
        expect(address_line_2_input.value).toBe('');

        const address_town_input = screen.getByPlaceholderText(address.address_town);
        const town_text = 'Test town';
        expect(address_town_input.value).toBe('');

        const address_state_input = screen.getByPlaceholderText(address.address_state);
        const address_state_text = 'Test state';
        expect(address_state_input.value).toBe('Default test state');

        const address_postcode_input = screen.getByPlaceholderText(address.address_postcode);
        const address_postcode_text = 'Test postcode';
        expect(address_postcode_input.value).toBe('');

        fireEvent.change(address_line_1_input, { target: { value: first_line_address_text } });

        fireEvent.change(address_line_2_input, { target: { value: second_line_address_text } });

        fireEvent.change(address_town_input, { target: { value: town_text } });

        fireEvent.change(address_state_input, { target: { value: address_state_text } });

        fireEvent.change(address_postcode_input, { target: { value: address_postcode_text } });

        await waitFor(() => {
            expect(address_line_1_input.value).toBe(first_line_address_text);
            expect(address_line_2_input.value).toBe(second_line_address_text);
            expect(address_town_input.value).toBe(town_text);
            expect(address_state_input.value).toBe(address_state_text);
            expect(address_postcode_input.value).toBe(address_postcode_text);
        });

        const submit_btn = screen.getByRole('button', { name: /Submit/i });
        await waitFor(() => {
            fireEvent.click(submit_btn);
        });
        expect(submit_btn).toBeEnabled();
    });

    it('should render the fileuploader mock component', async () => {
        render(<CFDPOA {...props} />);
        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();
        expect(screen.getByText(/FileUploaderContainer/i)).toBeInTheDocument();
    });
});
