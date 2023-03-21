import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CFDPOA from '../cfd-poa';
import { BrowserRouter } from 'react-router-dom';
import { WS, isDesktop, isMobile } from '@deriv/shared';

const poa_status_codes = {
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    verified: 'verified',
    expired: 'expired',
    suspected: 'suspected',
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getLocation: jest.fn().mockReturnValue('Default test state'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    makeCancellablePromise: jest.fn(() => ({ cancel: jest.fn(), promise: Promise.resolve('resolved') })),
}));

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FileUploaderContainer: () => <div>FileUploaderContainer</div>,
    FormSubHeader: jest.fn(props => <div>{props.title}</div>),
    PoaStatusCodes: jest.fn(() => {
        poa_status_codes.none;
    }),
}));

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            getAccountStatus: jest.fn().mockResolvedValue({
                get_account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'none',
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

const renderwithRouter = component => {
    render(<BrowserRouter>{component}</BrowserRouter>);
};

const error_messages = {
    address_line_1: 'First line of address is required',
    town_city: 'Town/City is required.',
};

describe('<CFDPOA />', () => {
    const address = {
        address_line_1: 'First line of address*',
        address_line_2: 'Second line of address',
        address_postcode: 'Postal/ZIP code',
        address_state: 'State/Province',
        address_town: 'Town/City*',
    };

    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    let props;

    beforeEach(() => {
        props = {
            onSave: jest.fn(),
            index: 1,
            onSubmit: jest.fn(),
            refreshNotifications: jest.fn(),
            form_error: undefined,
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
                address_line_1: '',
                address_line_2: '',
                address_city: '',
                address_postcode: '',
                address_state: 'Default test state',
            },
        };
    });

    it('should render the POA component form', async () => {
        renderwithRouter(<CFDPOA {...props} />);

        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        expect(screen.getByText(/First line of address*/i)).toBeInTheDocument();
        expect(screen.getByText(/Second line of address \(optional\)/i)).toBeInTheDocument();
        expect(screen.getByText('Town/City*')).toBeInTheDocument();
        expect(screen.getByText('State/Province')).toBeInTheDocument();
        expect(screen.getByText('Postal/ZIP code')).toBeInTheDocument();
        expect(screen.getByText(/FileUploaderContainer/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });

    it('should disable the next button if there are no values', async () => {
        renderwithRouter(<CFDPOA {...props} />);
        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        const next_btn = screen.getByRole('button', { name: /Next/i });
        expect(next_btn.disabled).toBe(true);
    });

    it('should render the correct input values', async () => {
        const new_props = {
            ...props,
            value: {
                address_line_1: 'dead end',
                address_line_2: 'Psycho Path',
                address_city: 'hells kitchen',
                address_postcode: '666',
                address_state: 'alabama',
            },
        };
        renderwithRouter(<CFDPOA {...new_props} />);

        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        const address_line_1_input = screen.getByPlaceholderText(address.address_line_1);
        const address_line_2_input = screen.getByPlaceholderText(address.address_line_2);
        const address_town_input = screen.getByPlaceholderText(address.address_town);
        const address_state_input = screen.getByPlaceholderText(address.address_state);
        const address_postcode_input = screen.getByPlaceholderText(address.address_postcode);

        expect(address_line_1_input.value).toBe('dead end');
        expect(address_line_2_input.value).toBe('Psycho Path');
        expect(address_town_input.value).toBe('hells kitchen');
        expect(address_state_input.value).toBe('alabama');
        expect(address_postcode_input.value).toBe('666');
    });

    it('should have validation errors on form if fields are empty', async () => {
        renderwithRouter(<CFDPOA {...props} />);

        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        const address_line_1_input = screen.getByPlaceholderText(address.address_line_1);
        const address_town_input = screen.getByPlaceholderText(address.address_town);

        fireEvent.blur(address_line_1_input);
        fireEvent.blur(address_town_input);

        await waitFor(() => {
            expect(screen.getByText(error_messages.address_line_1)).toBeInTheDocument();
            expect(screen.getByText(error_messages.town_city)).toBeInTheDocument();
        });
    });

    it('should render the fileuploader mock component', async () => {
        render(<CFDPOA {...props} />);
        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();
        expect(screen.getByText(/FileUploaderContainer/i)).toBeInTheDocument();
    });

    it('should render the error title if POA has failed', async () => {
        WS.authorized.getAccountStatus.mockResolvedValue({
            get_account_status: {
                authentication: {
                    document: {
                        status: 'rejected',
                    },
                    identity: {
                        status: 'rejected',
                    },
                },
            },
        });
        render(<CFDPOA {...props} />);
        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                'We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.'
            )
        ).toBeInTheDocument();
    });

    it('should render CFDPOA component with states_list combobox for mobile', async () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);

        props.states_list = [
            { text: 'State 1', value: 'State 1' },
            { text: 'State 2', value: 'State 2' },
        ];

        render(<CFDPOA {...props} />);
        expect(await screen.findByText(/Address information/i)).toBeInTheDocument();

        const address_state_input = screen.getByRole('combobox');
        expect(address_state_input.value).toBe('');
        fireEvent.change(address_state_input, { target: { value: 'State 2' } });
        await waitFor(() => {
            expect(address_state_input.value).toBe('State 2');
        });
    });
});
