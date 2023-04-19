import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionCardSection from '../jurisdiction-card-section';

describe('JurisdictionCardSection', () => {
    type TMockProps = {
        card_section_item: {
            key: string;
            title: string;
            title_indicators?: {
                type: 'displayText';
                display_text: string;
                display_text_skin_color: string;
            };
            description?: string;
            clickable_description?: [];
        };
        toggleCardFlip: jest.Mock;
    };
    const mock_props: TMockProps = {
        card_section_item: {
            key: '',
            title: 'Test Title',
            title_indicators: {
                type: 'displayText' as const,
                display_text: 'Test Title Indicators Text',
                display_text_skin_color: '',
            },
            description: 'Test Description',
        },
        toggleCardFlip: jest.fn(),
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
