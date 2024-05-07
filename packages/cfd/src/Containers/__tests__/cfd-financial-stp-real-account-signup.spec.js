import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDFinancialStpRealAccountSignup from '../cfd-financial-stp-real-account-signup';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';
import { getAuthenticationStatusInfo } from '@deriv/shared';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    FormSubHeader: () => <div>FormSubHeader</div>,
}));

const MockComponent = ({ prevStep, nextStep }) => (
    <div>
        <button onClick={prevStep}>Prev Step</button>
        <button onClick={() => nextStep(0, {})}>Next Step</button>
    </div>
);

jest.mock('../../Components/cfd-poa', () =>
    jest.fn(({ onCancel, onSubmit }) => (
        <div>
            CFDPOA
            <MockComponent prevStep={onCancel} nextStep={onSubmit} />
        </div>
    ))
);

jest.mock('../../Components/cfd-poi', () =>
    jest.fn(({ onCancel, onSubmit }) => (
        <div>
            CFDPOI
            <MockComponent prevStep={onCancel} nextStep={onSubmit} />
        </div>
    ))
);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getAuthenticationStatusInfo: jest.fn().mockReturnValue({}),
}));

const getByTextFn = (text, should_be) => {
    if (should_be) {
        expect(screen.getByText(text)).toBeInTheDocument();
    } else {
        expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
};

const testAllStepsFn = (steps, step_no) => {
    steps.map((step, index) => {
        if (index === step_no) {
            getByTextFn(step.body, true);
        } else {
            getByTextFn(step.body, false);
        }
    });
};

const steps = [
    {
        body: 'CFDPOI',
    },
    {
        body: 'CFDPOA',
    },
];

describe('<CFDFinancialStpRealAccountSignup />', () => {
    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const verified_jurisdiction = {
        bvi: 1,
        labuan: 1,
        maltainvest: 0,
        svg: 1,
        vanuatu: 0,
        virtual: 0,
    };

    let mockRootStore = {
        notifications: {
            addNotificationByKey: jest.fn(),
            refreshNotifications: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
        },
        client: {
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
                first_name: 'mahdiyeh',
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
            account_status: {
                authentication: {
                    document: {
                        verified_jurisdiction,
                        status: 'none',
                    },
                    attempts: {
                        latest: {
                            service: 'idv',
                        },
                    },
                },
            },
            authentication_status: {
                document_status: 'none',
                identity_status: 'none',
            },
            email: 'mock@gmail.com',
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
            fetchStatesList: jest.fn(),
            states_list: {
                text: 'Central Singapore',
                value: '01',
            },
        },
        modules: {
            cfd: {
                storeProofOfAddress: jest.fn(),
            },
        },
        jurisdiction_selected_shortcode: 'svg',
    };

    it('should render CFDFinancialStpRealAccountSignup component', () => {
        render(<CFDFinancialStpRealAccountSignup />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        expect(screen.getByTestId('dt_cfd_financial_stp_modal_body')).toBeInTheDocument();
    });

    it('should render properly for the first step content', () => {
        getAuthenticationStatusInfo.mockReturnValueOnce({ need_poi_for_bvi_labuan_vanuatu: true });
        render(<CFDFinancialStpRealAccountSignup />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        testAllStepsFn(steps, 0);
    });

    it('should render properly for the second step content', () => {
        getAuthenticationStatusInfo.mockReturnValueOnce({ poa_resubmit_for_labuan: true });
        const { getByTestId } = render(<CFDFinancialStpRealAccountSignup />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        testAllStepsFn(steps, 1);
    });

    it('should check for POI status when Jurisdiction is Vanuatu or maltainvest', () => {
        const new_mock_store = {
            ...mockRootStore,
            modules: {
                ...mockRootStore.modules,
                cfd: {
                    ...mockRootStore.modules.cfd,
                    jurisdiction_selected_shortcode: 'vanuatu',
                },
            },
        };

        getAuthenticationStatusInfo.mockReturnValueOnce({ need_poi_for_bvi_labuan_vanuatu: true });

        render(<CFDFinancialStpRealAccountSignup />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mock_store)}>{children}</CFDProviders>,
        });
        testAllStepsFn(steps, 0);
    });

    it('should check for POA status when Jurisdiction is Labuan and resubmit status is set to true', () => {
        const verified_jurisdiction = {
            bvi: 1,
            labuan: 0,
            maltainvest: 0,
            svg: 1,
            vanuatu: 0,
            virtual: 0,
        };
        const new_mock_store = {
            ...mockRootStore,
            client: {
                ...mockRootStore.client,
                account_status: {
                    authentication: {
                        document: {
                            verified_jurisdiction,
                            status: 'none',
                        },
                        attempts: {
                            latest: {
                                service: 'idv',
                            },
                        },
                    },
                },
            },
            modules: {
                ...mockRootStore.modules,
                cfd: {
                    ...mockRootStore.modules.cfd,
                    jurisdiction_selected_shortcode: 'labuan',
                },
            },
        };

        getAuthenticationStatusInfo.mockReturnValueOnce({ need_poi_for_maltainvest: true });

        render(<CFDFinancialStpRealAccountSignup />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mock_store)}>{children}</CFDProviders>,
        });
        testAllStepsFn(steps, 1);
    });
});
