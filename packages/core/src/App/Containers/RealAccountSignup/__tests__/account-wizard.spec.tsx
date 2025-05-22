import React from 'react';
import { render, screen } from '@testing-library/react';
import { useGetPhoneNumberList, useIsClientHighRiskForMT5 } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import AccountWizard from '../account-wizard';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useIsClientHighRiskForMT5: jest.fn(),
    useGetPhoneNumberList: jest.fn(),
}));

const mockUseIsClientHighRiskForMT5 = useIsClientHighRiskForMT5 as jest.MockedFunction<
    typeof useIsClientHighRiskForMT5
>;

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

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn().mockResolvedValue({}),
    },
}));

const mock_form_data = { name: 'Test', document_number: 'none', document_type: { id: 'none' } };

const Test = ({ onSubmit }) => (
    <div>
        TestComponent
        <button onClick={() => onSubmit(0, mock_form_data)}>Submit</button>
    </div>
);

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
    beforeEach(() => {
        mockUseIsClientHighRiskForMT5.mockReturnValue(false);
        (useGetPhoneNumberList as jest.Mock).mockReturnValue({
            legacy_core_countries_list: [
                { text: 'United States (+1)', value: '+1', id: '1_US', carriers: [], disabled: false },
            ],
        });
    });

    const store = mockStore({
        client: {
            account_status: {
                currency_config: { usd: {} },
                p2p_status: 'none',
                risk_classification: '',
                status: [],
            },
            fetchAccountSettings: jest.fn(),
            fetchResidenceList: jest.fn(),
            fetchStatesList: jest.fn(),
            financial_assessment: [],
            has_currency: true,
            has_real_account: false,
            has_residence: true,
            is_virtual: true,
            onFinishSuccess: jest.fn(),
            realAccountSignup: jest.fn().mockResolvedValue({ new_account_real: { currency: 'USD' } }),
            setIsRiskWarningVisible: jest.fn(),
            onError: jest.fn(),
            residence: 'id',
            setRealAccountFormData: jest.fn(),
            upgrade_info: '',
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
        },
        ui: {
            closeRealAccountSignup: jest.fn(),
            real_account_signup_target: 'svg',
            setIsRealAccountSignupModalVisible: jest.fn(),
            setIsTradingAssessmentForNewUserEnabled: jest.fn(),
            setShouldShowAppropriatenessWarningModal: jest.fn(),
            setShouldShowRiskWarningModal: jest.fn(),
            setSubSectionIndex: jest.fn(),
            sub_section_index: 0,
        },
        traders_hub: {
            content_flag: '',
        },
        notifications: {
            refreshNotifications: jest.fn(),
        },
    });

    const renderComponent = (mock_store = mockStore({})) => {
        return render(
            <StoreProvider store={mock_store}>
                <AccountWizard setLoading={jest.fn} setRealAccountFormData={jest.fn} />
            </StoreProvider>
        );
    };

    it('should render AccountWizard component', () => {
        renderComponent(store);
        expect(screen.getByTestId('dt_wizard')).toBeInTheDocument();
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });

    it('should fetch ResidenceList if ResidenceList is empty ', () => {
        const updatedStore = {
            ...store,
            client: {
                ...store.client,
                residence_list: [],
            },
        };
        renderComponent(updatedStore);
        expect(store.client.fetchResidenceList).toBeCalledTimes(1);
        expect(screen.getByTestId('dt_wizard')).toBeInTheDocument();
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });

    it('should fetch StatesList if StatesList is empty ', () => {
        const updatedStore = {
            ...store,
            client: {
                ...store.client,
                states_list: [],
            },
        };
        renderComponent(updatedStore);
        expect(store.client.fetchStatesList).toBeCalledTimes(1);
        expect(screen.getByText('TestComponent')).toBeInTheDocument();
    });

    it('should invoke Create account and IDV data submission APIs on click of Submit button', async () => {
        renderComponent(store);
        const ele_submit_btn = screen.getByRole('button');
        expect(ele_submit_btn).toHaveTextContent('Submit');
    });
});
