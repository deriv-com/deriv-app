import React from 'react';
import { render, screen } from '@testing-library/react';
import JurisdictionClickableDescription from '../jurisdiction-clickable-description';

describe('JurisdictionClickableDescription', () => {
    type TClickableDescription = { text: string; type: 'link' | 'text' };
    type TMockProps = {
        clickable_description: TClickableDescription[];
        toggleCardFlip: jest.Mock;
    };

    const mock_props: TMockProps = {
        clickable_description: [
            {
                text: 'Click here',
                type: 'link',
            },
            {
                text: 'to learn more about the documents required for verification.',
                type: 'text',
            },
        ],
        toggleCardFlip: jest.fn(),
    };

    it('should render JurisdictionClickableDescription', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        const container = screen.getByTestId('dt_jurisdiction_clickable_description');
        expect(container).toHaveClass('cfd-card-clickable-description-link');
        expect(screen.getByText('Click here')).toBeInTheDocument();
        expect(screen.getByText('to learn more about the documents required for verification.')).toBeInTheDocument();
    });

    it('should call toggleCardFlip when link is clicked', () => {
        render(<JurisdictionClickableDescription {...mock_props} />);
        screen.getByText('Click here').click();
        expect(mock_props.toggleCardFlip).toHaveBeenCalled();
    });
});
