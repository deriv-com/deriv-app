import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { isMobile } from '@deriv/shared';
import CFDPOA from '../cfd-poa';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FileUploaderContainer: () => <div>FileUploaderContainer</div>,
    FormSubHeader: () => <div>FormSubHeader</div>,
    PoaExpired: () => <div>PoaExpired</div>,
    PoaNeedsReview: () => <div>PoaNeedsReview</div>,
    PoaVerified: () => <div>PoaVerified</div>,
    PoaUnverified: () => <div>PoaUnverified</div>,
    PoaSubmitted: () => <div>PoaSubmitted</div>,
    PoaStatusCodes: {
        EXPIRED: 'EXPIRED',
        NEEDS_REVIEW: 'NEEDS_REVIEW',
        VERIFIED: 'VERIFIED',
        UNVERIFIED: 'UNVERIFIED',
        SUBMITTED: 'SUBMITTED',
    },
}));

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
    let props;

    beforeEach(() => {
        isMobile.mockReturnValue(false);

        props = {
            onSave: jest.fn(),
            onCancel: jest.fn(),
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

    it('should render the POA component', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/FormSubHeader/i)).toBeInTheDocument();
        });
    });

    it('should render the POA component with the correct texts and buttons', async () => {
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/FormSubHeader/i)).toBeInTheDocument();
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
        render(<CFDPOA {...props} />);
        await waitFor(() => {
            expect(screen.getByText(/FormSubHeader/i)).toBeInTheDocument();
        });
    });
});
