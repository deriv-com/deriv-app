import React from 'react';
import { render, screen } from '@testing-library/react';
import JurisdictionClickableDescription from '../jurisdiction-clickable-description';

describe('JurisdictionClickableDescription', () => {
    const mock_props = {
        clickable_description: [
            {
                text: 'Click here',
                type: 'link' as const,
            },
            {
                text: 'to learn more about the documents required for verification.',
                type: 'text' as const,
            },
        ],
        toggleCardFlip: jest.fn(),
    };

    it('should render JurisdictionClickableDescription', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        expect(screen.getByText('Click here')).toBeInTheDocument();
        expect(screen.getByText('to learn more about the documents required for verification.')).toBeInTheDocument();
    });

    it('should call toggleCardFlip when link is clicked', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        screen.getByText('Click here').click();
        expect(mock_props.toggleCardFlip).toHaveBeenCalled();
    });
});
