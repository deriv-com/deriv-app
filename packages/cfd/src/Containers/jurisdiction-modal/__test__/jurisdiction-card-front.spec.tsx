import React from 'react';
import JurisdictionCardFront from '../jurisdiction-card-front';
import { render, screen } from '@testing-library/react';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionCardFront', () => {
    const p2p_status: 'none' | 'active' | 'temp_ban' | 'perm_ban' = 'active';
    const prompt_client_to_authenticate: 0 | 1 = 1;
    const mock_props = {
        account_status: {
            p2p_poa_required: 1,
            currency_config: { usd: {} },
            p2p_status,
            prompt_client_to_authenticate,
            risk_classification: '',
            status: [],
        },
        disabled: false,
        type_of_card: Jurisdiction.SVG,
        card_classname: 'jurisdiction_test',
        toggleCardFlip: jest.fn(),
        card_values: {
            financial_contents: [
                {
                    key: '',
                    title: '',
                    description: '',
                    title_indicators: {
                        type: 'displayText' as const,
                        display_text: '',
                        display_text_skin_color: '',
                    },
                },
            ],
            synthetic_contents: [
                {
                    key: '',
                    title: '',
                    description: '',
                    title_indicators: {
                        type: 'displayText' as const,
                        display_text: '',
                        display_text_skin_color: '',
                    },
                },
            ],
            header: 'Test Header',
            over_header: 'Test Over Header',
            is_over_header_available: false,
        },
        card_data: [
            {
                key: 'Test1',
                title: 'Test Title 1',
                description: 'Test Description 1',
                title_indicators: {
                    type: 'displayText' as const,
                    display_text: 'Test 1',
                    display_text_skin_color: '',
                },
            },
            {
                key: 'Test2',
                title: 'Test Title 2',
                description: 'Test Description 2',
                title_indicators: {
                    type: 'displayText' as const,
                    display_text: 'Test 2',
                    display_text_skin_color: '',
                },
            },
        ],
        is_card_selected: false,
        verification_docs: [],
    };

    it('should render JurisdictionCardFront without over header', () => {
        render(<JurisdictionCardFront {...mock_props} />);
        expect(screen.getByText('Test Header')).toBeInTheDocument();
        expect(screen.getByText('Test Title 1')).toBeInTheDocument();
        expect(screen.getByText('Test 1')).toBeInTheDocument();
        expect(screen.getByText('Test Description 1')).toBeInTheDocument();
        expect(screen.getByText('Test Title 2')).toBeInTheDocument();
        expect(screen.getByText('Test 2')).toBeInTheDocument();
        expect(screen.getByText('Test Description 2')).toBeInTheDocument();
        expect(screen.queryByText('Test Over Header')).not.toBeInTheDocument();
    });

    it('should render JurisdictionCardFront with over header', () => {
        mock_props.card_values.is_over_header_available = true;
        render(<JurisdictionCardFront {...mock_props} />);
        expect(screen.getByText('Test Over Header')).toBeInTheDocument();
    });
});
