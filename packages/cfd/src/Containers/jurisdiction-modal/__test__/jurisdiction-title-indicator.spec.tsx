import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionTitleIndicator from '../jurisdiction-title-indicator';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionTitleIndicator', () => {
    type TMockProps = {
        title_indicators: {
            type: 'displayText' | 'displayIcons';
            display_text?: string;
        };
        type_of_card: 'svg' | 'bvi' | 'vanuatu' | 'labuan' | 'maltainvest';
        account_status: {
            authentication: {
                document: {
                    status: 'none' | 'pending' | 'verified' | 'expired' | 'rejected' | undefined;
                };
                identity: {
                    services: {
                        idv: {
                            status: 'none' | 'pending' | 'verified' | 'expired' | 'rejected' | undefined;
                        };
                        onfido: {
                            status: 'none' | 'pending' | 'verified' | 'expired' | 'rejected' | undefined;
                        };
                        manual: {
                            status: 'none' | 'pending' | 'verified' | 'expired' | 'rejected' | undefined;
                        };
                    };
                };
                needs_verification: string[];
            };
            currency_config: {
                [k: string]: {
                    is_deposit_suspended?: 0 | 1;
                    is_withdrawal_suspended?: 0 | 1;
                };
            };
            p2p_status: 'none';
            prompt_client_to_authenticate: 0;
            risk_classification: string;
            status: string[];
        };
        verification_docs: ['document_number' | 'selfie' | 'identity_document' | 'name_and_address' | 'not_applicable'];
    };
    const mock_props: TMockProps = {
        title_indicators: {
            type: 'displayText',
            display_text: 'Test Display Text',
        },
        type_of_card: Jurisdiction.BVI,
        account_status: {
            authentication: {
                document: {
                    status: 'none' as const,
                },
                identity: {
                    services: {
                        idv: {
                            status: 'none' as const,
                        },
                        onfido: {
                            status: 'none' as const,
                        },
                        manual: {
                            status: 'none' as const,
                        },
                    },
                },
                needs_verification: [],
            },
            currency_config: {},
            p2p_status: 'none' as const,
            prompt_client_to_authenticate: 0 as const,
            risk_classification: '',
            status: [''],
        },
        verification_docs: ['not_applicable'],
    };
    it('should render JurisdictionTitleIndicator with displayText', () => {
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByText('Test Display Text')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons', () => {
        mock_props.title_indicators.type = 'displayIcons';
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Default icon variant', () => {
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Default_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant', () => {
        mock_props.account_status.authentication.identity.services.idv.status = 'pending';
        mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant', () => {
        mock_props.account_status.authentication.identity.services.idv.status = 'rejected';
        mock_props.account_status.authentication.identity.services.onfido.status = 'rejected';
        mock_props.account_status.authentication.identity.services.manual.status = 'rejected';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant', () => {
        mock_props.account_status.authentication.identity.services.idv.status = 'verified';
        mock_props.account_status.authentication.identity.services.onfido.status = 'verified';
        mock_props.account_status.authentication.identity.services.manual.status = 'verified';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be Vanuatu', () => {
        mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be MaltaInvest', () => {
        mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['identity_document'];
        mock_props.type_of_card = Jurisdiction.MALTA_INVEST;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant with type_of_card to be Vanuatu', () => {
        mock_props.account_status.authentication.identity.services.onfido.status = 'rejected';
        mock_props.account_status.authentication.identity.services.manual.status = 'rejected';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant with type_of_card to be Vanuatu', () => {
        mock_props.account_status.authentication.identity.services.onfido.status = 'verified';
        mock_props.account_status.authentication.identity.services.manual.status = 'verified';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        mock_props.account_status.authentication.document.status = 'pending';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        mock_props.account_status.authentication.document.status = 'rejected';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        mock_props.account_status.authentication.document.status = 'verified';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });
});
