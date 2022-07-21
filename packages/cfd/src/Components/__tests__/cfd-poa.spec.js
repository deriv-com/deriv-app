import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import CFDPOA from '../cfd-poa';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FileUploaderContainer: () => <div>FileUploaderContainer</div>,
    FormSubHeader: jest.fn(props => <div>{props.title}</div>),
    PoaStatusCodes: jest.fn(() => {
        poa_status_codes;
    }),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

const poa_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            getAccountStatus: jest.fn().mockResolvedValue({ get_account_status: 1 }),
        },
        wait: (...payload) => {
            return Promise.resolve([...payload]);
        },
    },
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

describe('<CFDPOA />', () => {
    const address_line_1 = 'First line of address*';
    const address_line_2 = 'Second line of address';
    const address_postcode = 'Postal/ZIP code';
    const address_state = 'State/Province';
    const address_town = 'Town/City*';

    let props;

    beforeEach(() => {
        isMobile.mockReturnValue(false);

        props = {
            onSave: jest.fn(),
            onCancel: jest.fn(),
            index: 1,
            onSubmit: jest.fn(),
            refreshNotifications: jest.fn(),
            form_error: 'test',
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
                poa_status: 'verified',
            },
        };
    });

    it('should render the POA component with the correct texts and buttons', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/Address information/i)).toBeInTheDocument();
            expect(screen.getByText(/First line of address*/i)).toBeInTheDocument();
            expect(screen.getByText(/Second line of address \(optional\)/i)).toBeInTheDocument();
            expect(screen.getByText('Town/City*')).toBeInTheDocument();
            expect(screen.getByText('State/Province')).toBeInTheDocument();
            expect(screen.getByText('Postal/ZIP code')).toBeInTheDocument();
            expect(screen.getByText(/FileUploaderContainer/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
        });
    });
    it('should render the correct input for all the fields', async () => {
        render(<CFDPOA {...props} onSubmit={() => true} />);

        await waitFor(() => {
            expect(screen.getByText(/Address information/i)).toBeInTheDocument();
        });

        const address_line_1_input = screen.getByPlaceholderText(address_line_1);
        const first_line_address_text = 'Test first line address';
        expect(address_line_1_input.value).toBe('');
        fireEvent.change(address_line_1_input, { target: { value: first_line_address_text } });
        await waitFor(() => {
            expect(address_line_1_input.value).toBe(first_line_address_text);
        });

        const address_line_2_input = screen.getByPlaceholderText(address_line_2);
        const second_line_address_text = 'Test second line address';
        expect(address_line_2_input.value).toBe('');
        fireEvent.change(address_line_2_input, { target: { value: second_line_address_text } });
        await waitFor(() => {
            expect(address_line_2_input.value).toBe(second_line_address_text);
        });

        const address_town_input = screen.getByPlaceholderText(address_town);
        const town_text = 'Test town';
        expect(address_town_input.value).toBe('');
        fireEvent.change(address_town_input, { target: { value: town_text } });
        await waitFor(() => {
            expect(address_town_input.value).toBe(town_text);
        });

        const address_state_input = screen.getByPlaceholderText(address_state);
        const address_state_text = 'Test state';
        expect(address_state_input.value).toBe('Default test state');
        fireEvent.change(address_state_input, { target: { value: address_state_text } });
        await waitFor(() => {
            expect(address_state_input.value).toBe(address_state_text);
        });

        const address_postcode_input = screen.getByPlaceholderText(address_postcode);
        const address_postcode_text = 'Test postcode';
        expect(address_postcode_input.value).toBe('');
        fireEvent.change(address_postcode_input, { target: { value: address_postcode_text } });
        await waitFor(() => {
            expect(address_postcode_input.value).toBe(address_postcode_text);
        });

        const submit_btn = screen.getByRole('button', { name: /Submit/i });
        await waitFor(() => {
            fireEvent.click(submit_btn);
        });
        expect(submit_btn).toBeEnabled();
    });

    it('should call onCancel if the user clicks Previous button', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/Address information/i)).toBeInTheDocument();
        });
        const previous_btn = screen.getByRole('button', { name: /Previous/i });
        expect(previous_btn).toBeInTheDocument();
        fireEvent.click(previous_btn);
        await waitFor(() => {
            expect(props.onCancel).toHaveBeenCalled();
        });
    });

    it('should show error if submit button is clicked', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/Address information/i)).toBeInTheDocument();
        });
        const submit_btn = screen.getByRole('button', { name: /Submit/i });
        fireEvent.click(submit_btn);
        await waitFor(() => {
            expect(screen.getByText(/First line of address is required/i)).toBeInTheDocument();
            expect(screen.getByText('Town/City is required.')).toBeInTheDocument();
        });
    });

    it('should trigger the onSave callback when the user clicks on the previous button', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/Address information/i)).toBeInTheDocument();
        });
        const address_line_1_input = screen.getByPlaceholderText(address_line_1);
        const first_line_address_text = 'Test first line address';
        expect(address_line_1_input.value).toBe('');
        fireEvent.change(address_line_1_input, { target: { value: first_line_address_text } });
        await waitFor(() => {
            expect(address_line_1_input.value).toBe(first_line_address_text);
        });

        const address_line_2_input = screen.getByPlaceholderText(address_line_2);
        const second_line_address_text = 'Test second line address';
        expect(address_line_2_input.value).toBe('');
        fireEvent.change(address_line_2_input, { target: { value: second_line_address_text } });
        await waitFor(() => {
            expect(address_line_2_input.value).toBe(second_line_address_text);
        });

        const address_town_input = screen.getByPlaceholderText(address_town);
        const town_text = 'Test town';
        expect(address_town_input.value).toBe('');
        fireEvent.change(address_town_input, { target: { value: town_text } });
        await waitFor(() => {
            expect(address_town_input.value).toBe(town_text);
        });

        const address_state_input = screen.getByPlaceholderText(address_state);
        const address_state_text = 'Test state';
        expect(address_state_input.value).toBe('Default test state');
        fireEvent.change(address_state_input, { target: { value: address_state_text } });
        await waitFor(() => {
            expect(address_state_input.value).toBe(address_state_text);
        });

        const address_postcode_input = screen.getByPlaceholderText(address_postcode);
        const address_postcode_text = 'Test postcode';
        expect(address_postcode_input.value).toBe('');
        fireEvent.change(address_postcode_input, { target: { value: address_postcode_text } });
        await waitFor(() => {
            expect(address_postcode_input.value).toBe(address_postcode_text);
        });

        const prev_btn = screen.getByRole('button', { name: /Previous/i });
        await waitFor(() => {
            fireEvent.click(prev_btn);
        });
        await waitFor(() => {
            expect(props.onSave).toHaveBeenCalled();
        });
    });
});
