import React from 'react';
import { screen, render } from '@testing-library/react';
import JurisdictionTitleIndicator from '../jurisdiction-title-indicator';

describe('JurisdictionTitleIndicator', () => {
    type TMockProps = {
        title_indicators: {
            type: 'displayText' | 'displayIcons';
            display_text?: string;
            display_icons?: string[];
        };
    };
    const mock_props: TMockProps = {
        title_indicators: {
            type: 'displayText',
            display_text: 'Test Display Text',
            display_icons: [],
        },
    };
    it('should render JurisdictionTitleIndicator with displayText', () => {
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.getByText('Test Display Text')).toBeInTheDocument();
    });

    it('should render JurisdictionTitleIndicator with displayIcons', () => {
        mock_props.title_indicators.type = 'displayIcons';
        mock_props.title_indicators.display_icons = ['Test Icon'];
        render(<JurisdictionTitleIndicator {...mock_props} />);
        expect(screen.queryByText('Test Display Text')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Icon')).toBeInTheDocument();
    });
});
