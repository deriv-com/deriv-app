import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionTitleIndicator from '../jurisdiction-title-indicator';
import { TJurisdictionTitleIndicatorProps } from 'Containers/props.types';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionTitleIndicator', () => {
    const mock_props: TJurisdictionTitleIndicatorProps = {
        title_indicators: {
            type: 'displayText',
            display_text: 'Test Display Text',
        },
        type_of_card: Jurisdiction.BVI,
        account_status: {
            authentication: {
                document: {
                    status: 'none',
                },
                identity: {
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
        if (mock_props.account_status.authentication?.identity?.services?.idv?.status) {
            mock_props.account_status.authentication.identity.services.idv.status = 'pending';
        }
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant', () => {
        if (mock_props.account_status.authentication?.identity?.services?.idv?.status) {
            mock_props.account_status.authentication.identity.services.idv.status = 'rejected';
        }
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'rejected';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'rejected';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant', () => {
        if (mock_props.account_status.authentication?.identity?.services?.idv?.status) {
            mock_props.account_status.authentication.identity.services.idv.status = 'verified';
        }
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'verified';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'verified';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['document_number'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be Vanuatu', () => {
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant with type_of_card to be MaltaInvest', () => {
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'pending';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'pending';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['identity_document'];
        mock_props.type_of_card = Jurisdiction.MALTA_INVEST;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant with type_of_card to be Vanuatu', () => {
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'rejected';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'rejected';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant with type_of_card to be Vanuatu', () => {
        if (mock_props.account_status.authentication?.identity?.services?.onfido?.status) {
            mock_props.account_status.authentication.identity.services.onfido.status = 'verified';
        }
        if (mock_props.account_status.authentication?.identity?.services?.manual?.status) {
            mock_props.account_status.authentication.identity.services.manual.status = 'verified';
        }
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['selfie'];
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Pending icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        if (mock_props.account_status.authentication?.document?.status)
            mock_props.account_status.authentication.document.status = 'pending';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Pending_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Failed icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        if (mock_props.account_status.authentication?.document?.status)
            mock_props.account_status.authentication.document.status = 'rejected';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Failed_icon')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons and Verified icon variant when verification_document is name_and_address and type_of_card to be svg', () => {
        if (mock_props.account_status.authentication?.document?.status)
            mock_props.account_status.authentication.document.status = 'verified';
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.verification_docs = ['name_and_address'];
        mock_props.type_of_card = Jurisdiction.SVG;
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByTestId('dt_jurisdiction_title_indicator_Verified_icon')).toBeInTheDocument();
    });
});
