import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountWizard from '../account-wizard';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => (Component: React.ReactElement) => Component,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Wizard: jest.fn(({ children }) => <div data-testid='dt_wizard'>{children}</div>),
}));

jest.mock('../account-wizard-form', () => ({
    getItems: jest.fn(() => [
        {
            header: {
                active_title: 'Sample Active Title',
                title: ' Sample CURRENCY',
            },
            body: 'Test',
            form_value: [],
            props: {},
            passthrough: [''],
            icon: <div>Icon</div>,
        },
    ]),
}));

const Test = () => <div>TestComponent</div>;

jest.mock('../account-wizard-form', () => ({
    getItems: jest.fn(() => [
        {
            header: {
                active_title: 'Sample Active Title',
                title: ' Sample CURRENCY',
            },
            body: Test,
            form_value: [],
            props: {},
            passthrough: [''],
            icon: <div>Icon</div>,
        },
    ]),
}));

describe('<AccountWizard />', () => {
    const mock_props = {
        account_status: {
            currency_config: { usd: {} },
            p2p_status: 'none',
            risk_classification: '',
            status: [],
        },
        closeRealAccountSignup: jest.fn(),
        content_flag: '',
        fetchAccountSettings: jest.fn(),
        fetchResidenceList: jest.fn(),
        fetchStatesList: jest.fn(),
        financial_assessment: [],
        has_currency: true,
        has_real_account: false,
        has_residence: true,
        is_virtual: true,
        real_account_signup_target: 'svg',
        realAccountSignup: jest.fn(),
        refreshNotifications: jest.fn(),
        residence: 'id',
        setIsRealAccountSignupModalVisible: jest.fn(),
        setIsTradingAssessmentForNewUserEnabled: jest.fn(),
        setShouldShowAppropriatenessWarningModal: jest.fn(),
        setShouldShowRiskWarningModal: jest.fn(),
        upgrade_info: '',
        setSubSectionIndex: jest.fn(),
        sub_section_index: 0,
        getChangeableFields: jest.fn(),
        openPendingDialog: jest.fn(),
        removeNotificationByKey: jest.fn(),
        removeNotificationMessage: jest.fn(),
        storeProofOfAddress: jest.fn(),
        toggleModal: jest.fn(),
        account_settings: {
            account_opening_reason: '',
            address_city: 'MUDGEERABA',
            address_line_1: "29 Ross Street, .'",
            address_line_2: ".'",
            address_postcode: '111',
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
            first_name: 'mock_name',
            has_secret_answer: 1,
            immutable_fields: ['residence'],
            is_authenticated_payment_agent: 0,
            last_name: 'am',
            non_pep_declaration: 1,
            phone: '+651213456',
            place_of_birth: null,
            preferred_language: 'EN',
            request_professional_status: 0,
            residence: 'Singapore',
            salutation: '',
            tax_identification_number: null,
            tax_residence: null,
            user_hash: '823341c18bfccb391b6bb5d77ab7e6a83991f82669c1ba4e5b01dbd2fd71c7fe',
        },
        is_fully_authenticated: true,
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
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '93',
                text: 'Afghanistan',
                value: 'af',
            },
        ],
        states_list: [
            {
                text: 'Central Singapore',
                value: '01',
            },
        ],
        setLoading: jest.fn(),
    };

    it('should render AccountWizard component', () => {
        render(<AccountWizard {...mock_props} />);
        expect(screen.getByTestId('dt_wizard')).toBeInTheDocument();
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });

    it('should fetch ResidenceList if ResidenceList is empty ', () => {
        render(<AccountWizard {...mock_props} residence_list={[]} />);
        expect(mock_props.fetchResidenceList).toBeCalledTimes(1);
        expect(screen.getByTestId('dt_wizard')).toBeInTheDocument();
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });

    it('should fetch StatesList if StatesList is empty ', () => {
        render(<AccountWizard {...mock_props} states_list={[]} />);
        expect(mock_props.fetchStatesList).toBeCalledTimes(1);
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });
});
