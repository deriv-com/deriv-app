import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionTitleIndicator from '../jurisdiction-title-indicator';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import { Jurisdiction } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('JurisdictionTitleIndicator', () => {
    let store = mockStore({
        client: {
            account_status: {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        status: 'none',
                        services: {
                            idv: {
                                status: 'none',
                            },
                            onfido: {
                                status: 'none',
                            },
                            manual: {
                                status: 'none',
                            },
                        },
                    },
                    needs_verification: [],
                },
                currency_config: {},
                p2p_status: 'none',
                prompt_client_to_authenticate: 0,
                risk_classification: '',
                status: [''],
            },
        },
    });
    const mock_props: TJurisdictionTitleIndicatorProps = {
        title_indicators: {
            type: 'displayText',
            display_text: 'Test Display Text',
        },
        type_of_card: Jurisdiction.BVI,
        verification_docs: ['not_applicable'],
    };
    it('should render JurisdictionTitleIndicator with displayText', () => {
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Test Display Text')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons', () => {
        mock_props.title_indicators.type = 'displayIcons';
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Default icon variant', () => {
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Default_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'pending',
                            services: {
                                idv: {
                                    status: 'pending',
                                },
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'pending',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'rejected',
                            services: {
                                idv: {
                                    status: 'rejected',
                                },
                                onfido: {
                                    status: 'rejected',
                                },
                                manual: {
                                    status: 'rejected',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            verification_docs: ['document_number'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                idv: {
                                    status: 'verified',
                                },
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'pending',
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'pending',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be MaltaInvest', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.MALTA_INVEST,
            verification_docs: ['identity_document'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'pending',
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'pending',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'rejected',
                            services: {
                                onfido: {
                                    status: 'rejected',
                                },
                                manual: {
                                    status: 'rejected',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant with type_of_card to be Vanuatu', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.VANUATU,
            verification_docs: ['selfie'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'none',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'pending',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'rejected',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        const new_mock_props: TJurisdictionTitleIndicatorProps = {
            ...mock_props,
            title_indicators: {
                type: 'displayIcons',
                display_text: 'Test Display Text',
            },
            type_of_card: Jurisdiction.SVG,
            verification_docs: ['name_and_address'],
        };
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        document: {
                            status: 'verified',
                        },
                        identity: {
                            status: 'verified',
                            services: {
                                onfido: {
                                    status: 'verified',
                                },
                                manual: {
                                    status: 'verified',
                                },
                            },
                        },
                        needs_verification: [],
                    },
                    currency_config: {},
                    p2p_status: 'none',
                    prompt_client_to_authenticate: 0,
                    risk_classification: '',
                    status: [''],
                },
            },
        });
        render(
            <StoreProvider store={store}>
                <JurisdictionTitleIndicator {...new_mock_props} />
            </StoreProvider>
        );
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });
});
