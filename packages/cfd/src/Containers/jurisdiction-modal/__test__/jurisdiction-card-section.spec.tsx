import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionCardSection from '../jurisdiction-card-section';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionCardSection', () => {
    type TMockProps = {
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
        card_section_item: {
            key: string;
            title: string;
            title_indicators?: {
                type: 'displayText';
                display_text: string;
                display_text_skin_color: string;
            };
            description?: string;
            clickable_description?: [{ type: 'link' | 'text'; text: string }];
        };
        type_of_card: 'svg' | 'bvi' | 'vanuatu' | 'labuan' | 'maltainvest';
        toggleCardFlip: jest.Mock;
        verification_docs: ['document_number' | 'selfie' | 'identity_document' | 'name_and_address' | 'not_applicable'];
    };
    const mock_props: TMockProps = {
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
        card_section_item: {
            key: '',
            title: 'Test Title',
            title_indicators: {
                type: 'displayText',
                display_text: 'Test Title Indicators Text',
                display_text_skin_color: '',
            },
            description: 'Test Description',
        },
        type_of_card: Jurisdiction.SVG,
        toggleCardFlip: jest.fn(),
        verification_docs: ['not_applicable'],
    };

    it('should render JurisdictionCardSection component', () => {
        render(<JurisdictionCardSection {...mock_props} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title Indicators Text')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render JurisdictionCardSection component with clickable description', () => {
        const mock_props_with_clickable_description = {
            ...mock_props,
            card_section_item: {
                ...mock_props.card_section_item,
                clickable_description: [{ type: 'link' as const, text: 'Test Link' }],
            },
        };

        render(<JurisdictionCardSection {...mock_props_with_clickable_description} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title Indicators Text')).toBeInTheDocument();
        expect(screen.getByText('Test Link')).toBeInTheDocument();
        expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('should render JurisdictionCardSection component without displaying title indicators if it is empty', () => {
        mock_props.card_section_item.title_indicators = undefined;
        render(<JurisdictionCardSection {...mock_props} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByText('Test Title Indicators Text')).not.toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
});
